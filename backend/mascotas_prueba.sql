INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Luna','PERRO','Mestizo',24,'HEMBRA','MEDIANO','Luna es una perrita cariñosa y juguetona. Le encanta correr y jugar con niños.',true,false,true,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Pelusa','GATO','Angora',12,'HEMBRA','PEQUENIO','Pelusa es una gatita tranquila y cariñosa. Ideal para departamentos.',true,true,true,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Rocky','PERRO','Labrador',36,'MACHO','GRANDE','Rocky es un perrazo noble y protector. Muy inteligente.',true,false,true,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Michi','GATO','Mestizo',6,'MACHO','PEQUENIO','Michi es un gatito joven y muy curioso. Muy sociable.',true,false,false,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Toby','PERRO','Beagle',48,'MACHO','MEDIANO','Toby es un beagle alegre y curioso. Muy sociable con niños.',true,true,true,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

INSERT INTO mascotas (refugio_id, nombre, especie, raza, edad_meses, sexo, tamanio, descripcion, vacunado, esterilizado, desparasitado, estado, fecha_publicacion)
SELECT id,'Nala','GATO','Siames',18,'HEMBRA','PEQUENIO','Nala es una gata elegante y tranquila. Muy cariñosa con su dueño.',true,true,true,'DISPONIBLE',NOW() FROM usuarios WHERE email='refugio@patasfelices.com';

SELECT nombre, especie, tamanio, estado FROM mascotas;
