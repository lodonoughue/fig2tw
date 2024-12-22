# fig2tw

![CI](https://github.com/lodonoughue/fig2tw/actions/workflows/node.js.yml/badge.svg)

[fig2tw](https://www.figma.com/community/plugin/1376255637027661681/fig2tw) is
a Figma plugin that converts Figma variables into a Tailwind plugin, CSS or
JSON file.

## Getting started

1. **Open the [fig2tw](https://www.figma.com/community/plugin/1376255637027661681/fig2tw)
   plugin in Figma.**

2. **Download the generated TailwindCSS plugin.**

   From the Tailwind tab, download the tailwind plugin using the "Download"
   button and place the file next to your `tailwind.config.ts`.

3. **Import the generated plugin in your TailwindCSS configuration.**

   In the `tailwind.config.ts` file, import the generated plugin and place it
   in the plugins array. The configuration should look like below.

   ```typescript
   import fig2tw from "tailwind.fig2tw";

   const config = {
     plugins: [fig2tw],
     // ...
   };

   export default config;
   ```

4. _(Optional)_ **Configure the variable mode.**

   If you want to use variable values of different modes, you can apply a CSS
   class on any HTML element. This redefine CSS variables with other values on
   this element. All children will inherit these values.

   From the CSS tab, take a look at the CSS selectors. Find the class
   corresponding to the desired variable mode and use it on any element.

   For example, if you have a collection named **Theme** with **Light** and
   **Dark** modes, you'd find `.theme-light` and `.theme-dark` css classes. To
   apply the dark theme on the entire app, simply use the class like below.

   ```html
   <html class="theme-dark">
     <body>
       <p>Themed with dark colors</p>
     </body>
   </html>
   ```

## Key features

### Tailwind configuration is inferred from the variable scopes.

Configure the variable scopes in Figma to generate useful Tailwind configuration.

```html
<pre class="bg-primary text-on-primary rounded-sm gap-md p-xs">
  The background color is given by the variable "color/primary".
  The text color is given by the variable "color/on primary".
  The border-radius is given by the variable "radius/sm".
  The gap is given by the variable "space/md".
  The padding is given by the variable "space/xs".
</pre>
```

### All variable modes are converted into CSS variables.

Change the mode (light, dark, etc.) with a CSS class.

```html
<div class="theme-light">Figma's light mode variables are applied here</div>
<div class="theme-dark">Figma's dark mode variables are applied here.</div>
```

### Number units are configured by variable scope.

Define how numbers are to converted to CSS. You can choose from px, em, rem.
Font weights don't have units.

## Support

### TailwindCSS configuration scopes

`colors`, `fill`, `accentColor`, `backgroundColor`, `gradientColorStops`,
`borderColor`, `stroke`, `ringColor`, `ringOffsetColor`, `outlineColor`,
`textColor`, `textDecorationColor`, `caretColor`, `placeholderColor`,
`boxShadowColor`, `spacing`, `size`, `width`, `minWidth`, `maxWidth`, `height`,
`minHeight`, `maxHeight`, `margin`, `inset`, `borderRadius`, `padding`, `gap`,
`space`, `scrollMargin`, `scrollPadding`, `borderSpacing`, `strokeWidth`,
`outlineWidth`, `borderWidth`, `ringWidth`, `fontFamily`, `fontSize`,
`lineHeight`, `letterSpacing`, `fontWeight`

### Figma variable scopes

`ALL_SCOPES`, `ALL_FILLS`, `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`,
`STROKE_COLOR`, `EFFECT_COLOR`, `CORNER_RADIUS`, `WIDTH_HEIGHT`, `GAP`,
`STROKE_FLOAT`, `FONT_SIZE`, `LINE_HEIGHT`, `LETTER_SPACING`, `FONT_WEIGHT`,
`FONT_FAMILY`
