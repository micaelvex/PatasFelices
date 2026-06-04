package com.patasfelices.service;

import com.patasfelices.dto.*;
import com.patasfelices.model.*;
import com.patasfelices.repository.*;
import com.patasfelices.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacionRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository, TokenRecuperacionRepository tokenRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil, EmailService emailService,
                       AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El correo ya esta registrado");
        }
        Rol rol = Rol.valueOf(request.getRol().toUpperCase());
        if (rol == Rol.REFUGIO && (request.getNombreOrganizacion() == null || request.getNombreOrganizacion().isBlank())) {
            throw new IllegalArgumentException("El nombre de la organizacion es obligatorio para refugios");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setRol(rol);
        usuario.setEstado(EstadoCuenta.ACTIVO);
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setNombreOrganizacion(request.getNombreOrganizacion());
        usuario.setDistrito(request.getDistrito());
        usuarioRepository.save(usuario);
        emailService.enviarBienvenida(usuario.getEmail(), usuario.getNombre());
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());
        return new AuthResponse(token, usuario.getRol().name(), usuario.getNombre(), usuario.getId());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Correo o contrasena incorrectos");
        }
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        if (usuario.getEstado() == EstadoCuenta.BLOQUEADO) {
            throw new IllegalStateException("Tu cuenta ha sido bloqueada. Contacta al administrador.");
        }
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());
        return new AuthResponse(token, usuario.getRol().name(), usuario.getNombre(), usuario.getId());
    }

    public void forgotPassword(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            TokenRecuperacion token = new TokenRecuperacion();
            token.setUsuario(usuario);
            token.setToken(UUID.randomUUID().toString());
            token.setFechaExpiracion(LocalDateTime.now().plusMinutes(30));
            token.setUsado(false);
            tokenRepository.save(token);
            String enlace = "http://localhost:5173/reset-password?token=" + token.getToken();
            emailService.enviarRecuperacionPassword(usuario.getEmail(), usuario.getNombre(), enlace);
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNuevaPassword().equals(request.getConfirmarPassword())) {
            throw new IllegalArgumentException("Las contrasenas no coinciden");
        }
        TokenRecuperacion tokenObj = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token invalido o inexistente"));
        if (tokenObj.isUsado() || tokenObj.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El enlace ha expirado o ya fue utilizado");
        }
        Usuario usuario = tokenObj.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);
        tokenObj.setUsado(true);
        tokenRepository.save(tokenObj);
    }
}
