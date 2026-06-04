-- =============================================
-- DATOS DE PRUEBA - PatasFelices
-- Ejecutar en pgAdmin 4 con la BD patasfelices
-- =============================================

-- Usuario refugio de prueba (password: refugio123)
INSERT INTO usuarios (nombre, email, password, telefono, rol, estado, fecha_registro, nombre_organizacion, distrito)
VALUES (
  'Refugio Puno',
  'refugio@patasfelices.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjTtAEir/ua',
  '951234567',
  'REFUGIO',
  'ACTIVO',
  NOW(),
  'Refugio Animal Puno',
  'Puno'
) ON CONFLICT (email) DO NOTHING;

-- Usuario adoptante de prueba (password: adopta123)
INSERT INTO usuarios (nombre, email, password, telefono, rol, estado, fecha_registro)
VALUES (
  'Juan Perez',
  'adoptante@patasfelices.com',
  '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkLzA1OmJ0oCVvCWoGcjNhVXlMkVi',
  '987654321',
  'ADOPTANTE',
  'ACTIVO',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Mascotas de prueba
INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Luna',
  'PERRO',
  'Mestizo',
  24,
  'HEMBRA',
  'MEDIANO',
  'Luna es una perrita muy cariñosa y juguetona. Le encanta correr y jugar con niños. Busca un hogar con espacio.',
  true, false, true,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Pelusa',
  'GATO',
  'Angora',
  12,
  'HEMBRA',
  'PEQUENIO',
  'Pelusa es una gatita tranquila y cariñosa. Ideal para departamentos. Se lleva bien con otros gatos.',
  true, true, true,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Rocky',
  'PERRO',
  'Labrador',
  36,
  'MACHO',
  'GRANDE',
  'Rocky es un perrazo noble y protector. Muy inteligente, sabe varios comandos. Necesita espacio para correr.',
  true, false, true,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Michi',
  'GATO',
  'Mestizo',
  6,
  'MACHO',
  'PEQUENIO',
  'Michi es un gatito joven y muy curioso. Le encanta explorar y jugar. Muy sociable con personas.',
  true, false, false,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Toby',
  'PERRO',
  'Beagle',
  48,
  'MACHO',
  'MEDIANO',
  'Toby es un beagle alegre y curioso. Le encanta oler todo. Muy sociable con otros perros y niños.',
  true, true, true,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT
  u.id,
  'Nala',
  'GATO',
  'Siames',
  18,
  'HEMBRA',
  'PEQUENIO',
  'Nala es una gata elegante y tranquila. Muy cariñosa con su dueño. Prefiere hogares sin perros.',
  true, true, true,
  'DISPONIBLE',
  NOW()
FROM usuarios u WHERE u.email = 'refugio@patasfelices.com'
ON CONFLICT DO NOTHING;

-- Confirmacion
SELECT 'Datos insertados correctamente' as resultado;
SELECT nombre, especie, tamanio, estado FROM mascotas;
