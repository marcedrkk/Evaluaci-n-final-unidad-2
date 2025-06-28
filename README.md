# Evaluaci-n-final-unidad-2
Este repositorio contiene mi página web, la cual fue realizada como parte de la evaluación final de la Unidad 2 de la asignatura "Programación Web". Representó un gran esfuerzo por parte de nuestro grupo de trabajo (Benjamin, Kameron y yo), y aunque no todos los requerimientos fueron implementados, la mayoría sí lo fueron.

Este Pull Request consolida la implementación final del sistema de comercio electrónico VerdeVital. Incluye el desarrollo completo del frontend, backend, integración con Telegram y gestión de productos para usuarios con rol administrador. La aplicación permite a los clientes navegar, filtrar y comprar productos ecológicos de forma fluida, con stock actualizado y confirmación automática por mensajería.

## Autenticación:
- Login con token JWT
- Control de roles (cliente / admin)
- Middleware de seguridad para rutas protegidas

## Funcionalidades principales:
- Carrito persistente con localStorage
- Procesamiento de pedidos (base de datos SQLite)
- Descuento automático de stock tras cada compra
- Filtros de productos por nombre, categoría y precio
- Modo oscuro activable con `localStorage`

## Backend:
- Node.js + Express
- Rutas RESTful (`/api/login`, `/api/productos`, `/api/pedidos`)
- Base de datos SQLite con tablas `usuarios`, `productos`, `pedidos`, `pedido_items`
- Bot de Telegram integrado para alertas automáticas al canal

## Frontend:
- Páginas: `index`, `productos`, `admin`, `contacto`
- Estructura visual coherente y responsiva
- Modo oscuro persistente
- Panel de administración con CRUD completo
- Modales dinámicos (login, carrito, éxito)

## Issues abordados:
- Autenticación JWT y validación por rol
- CRUD de productos desde panel admin
- Compra + carrito + stock actualizado
- Notificación de pedidos con Telegram
- Modo oscuro con persistencia en `localStorage`
- Filtros de productos en catálogo

---
Sistema funcional
