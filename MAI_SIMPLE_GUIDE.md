# MAI Restaurando Vidas - Branding Simple

## 🎨 PASO 1: Paleta de Colores

**Colores disponibles como variables CSS:**

```css
--mai-gray-light: #ebebeb (Gris claro) --mai-gold: #ffc107 (Dorado - para destacados)
  --mai-blue: #22265d (Azul marino - principal) --mai-gray-dark: #333333 (Gris oscuro);
```

**Cómo usar:**

```html
<p style="color: var(--mai-blue);">Texto en azul</p>
<div style="background-color: var(--mai-gold);">Fondo dorado</div>
```

---

## 📝 PASO 2: Tipografía

**Principal: OUTFIT** (Sans-Serif)

- Para: Cuerpo de texto, párrafos, contenido general
- Uso automático en: `<p>`, `<span>`, `<li>`

**Secundaria: PLAYFAIR DISPLAY** (Serif)

- Para: Títulos `<h1>`, `<h2>`, `<h3>`, etc.

**Cómo usar:**

```html
<!-- Automático en títulos -->
<h1>Este es un título (Playfair Display)</h1>

<!-- Automático en párrafos -->
<p>Este es un párrafo (Outfit)</p>
```

---

## 🎯 PASO 3: Lineamientos de Diseño

### Uso de Color

- ✅ **Colores principales** (#22265D azul, #333333 gris) = fondos, textos
- ✅ **Dorado (#FFC107)** = destacados, titulares especiales
- ✅ **Mantener coherencia visual** en toda la aplicación

### Jerarquía Visual

```
h1 (2.5rem)     ← Más grande
  ↓
h2 (2rem)       ← Grande
  ↓
h3 (1.5rem)     ← Medio
  ↓
.subtitle (1.25rem) ← Subtítulo
  ↓
p (1rem)        ← Cuerpo de texto
  ↓
.text-secondary (0.95rem) ← Información secundaria
```

### Elementos Gráficos

- Gradientes respetando paleta MAI
- Texturas coherentes
- Ilustraciones que mantengan armonía

---

## 💻 Clases CSS Disponibles

### Texto

```html
<p class="text-primary">Texto en azul principal</p>
<p class="text-accent">Texto en dorado (destacado)</p>
<p class="text-secondary">Texto secundario más pequeño</p>
```

### Fondos

```html
<div class="bg-primary">Fondo azul con texto blanco</div>
<div class="bg-light">Fondo gris claro</div>
<div class="bg-dark">Fondo gris oscuro</div>
```

### Bordes

```html
<div class="border-accent">Borde en dorado</div>
<div class="border-primary">Borde en azul</div>
```

### Gradientes

```html
<div class="gradient-primary">Gradiente azul</div>
<div class="gradient-accent">Gradiente dorado</div>
```

---

## 📁 Archivos Modificados

1. **src/assets/main.css** - Imports de tipografías
2. **src/assets/styles/mai-foundation.css** - Colores y estilos base

---

## ✅ Estado Actual

- ✅ Paleta de colores MAI implementada
- ✅ Tipografía Outfit como principal
- ✅ Playfair Display para títulos
- ✅ Lineamientos de diseño establecidos
- ✅ Clases CSS simples y reutilizables
- ✅ Sin componentes complejos

---

## 🚀 Próximos Pasos

Una vez que los colores y tipografía estén bien, podemos:

1. Aplicar a componentes específicos
2. Crear secciones con el branding
3. Actualizar header/footer
4. Agregar más estilos personalizados

**¿Qué necesitas para el siguiente paso?**
