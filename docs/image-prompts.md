# Product photo prompts

Prompts for generating Aurél Studio's product photography with an AI image tool (ChatGPT, Midjourney or similar). Until a photo exists, the app shows a generated placeholder, so you can add photos one at a time.

Each product needs two images and the home page needs one hero image:

| File | What it shows |
| --- | --- |
| `<slug>-1` | Packshot: the item alone on the studio background, no people |
| `<slug>-2` | Styled or detail shot: close-up, hands or a partial model with no face |
| `hero` | Editorial image for the home page |

All images are portrait 4:5. The import script crops and resizes to 1600 × 2000.

## Shared style block

Paste this block at the start of every prompt. It keeps lighting, background and colour consistent across the set.

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
```

## Keeping the set consistent

- Always start with the style block, word for word.
- Generate in one session (ChatGPT) or reuse a seed or style reference (Midjourney `--seed`, `--sref`) once you have an image you like, and use it as the reference for the rest.
- Set the aspect ratio to 4:5 (Midjourney: `--ar 4:5`; ChatGPT: ask for a portrait 4:5 image).
- Compare new images against the ones you've kept, and regenerate outliers (different background tone, harsh shadows, stray props, visible text or logos, faces).
- The colourway in each prompt matches the first colour listed for that product in the store.

## Importing the photos

1. Save each image into `incoming-images/` (gitignored) using the file name in its heading, with a `.png`, `.jpg` or `.webp` extension, e.g. `incoming-images/alder-wool-overcoat-1.png`.
2. Run:

   ```bash
   npm run images:import
   ```

   The script centre-crops each image to 4:5, resizes it to 1600 × 2000, writes an optimised JPEG to `public/images/`, lists anything still missing and exits with an error for unrecognised file names.
3. Refresh the dev server. Photos replace the placeholders automatically. For a production deploy, rebuild.

## Hero

### `hero`

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Editorial fashion photograph for the autumn/winter campaign: a person seen from behind or cropped at the shoulders so no face is visible, wearing a long camel wool overcoat over an oatmeal cashmere knit, walking past a pale plaster arch. Warm neutral palette of ivory, sand, camel and charcoal with a touch of deep olive. Leave calm negative space at the top of the frame.
```

## Products

### Alder Wool Overcoat

**`alder-wool-overcoat-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a long, unlined camel double-faced wool-cashmere overcoat with notch lapels, dropped shoulders, a concealed button placket and two welt pockets, hem below the knee, laid perfectly flat, front facing, sleeves relaxed at the sides. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`alder-wool-overcoat-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a long, unlined camel double-faced wool-cashmere overcoat with notch lapels, dropped shoulders, a concealed button placket and two welt pockets, hem below the knee: a person from shoulders to mid-thigh wearing the coat open over an ivory knit, one hand in the pocket; close enough to see the soft brushed wool texture and clean hand-finished lapel edge. No face visible.
```

### Hale Waxed Field Jacket

**`hale-waxed-field-jacket-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of an olive-green waxed cotton field jacket with a brown corduroy collar, four bellows pockets with snaps and a brass two-way zip, on an invisible mannequin, three-quarter front view, zip closed. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`hale-waxed-field-jacket-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of an olive-green waxed cotton field jacket with a brown corduroy collar, four bellows pockets with snaps and a brass two-way zip: close-up of the corduroy collar and a snap pocket, showing the subtle sheen and creasing of the waxed cotton, a hand resting on the pocket flap. No face visible.
```

### Soren Quilted Liner Jacket

**`soren-quilted-liner-jacket-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a collarless sand-coloured quilted liner jacket with fine diamond quilting, snap front and two patch pockets, laid flat, front facing, snaps closed. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`soren-quilted-liner-jacket-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a collarless sand-coloured quilted liner jacket with fine diamond quilting, snap front and two patch pockets: a person from chin-down to waist wearing it over a white tee, close enough to show the diamond quilting and matte nylon texture. No face visible.
```

### Isla Cashmere Crewneck

**`isla-cashmere-crewneck-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of an oatmeal cashmere crewneck sweater with ribbed collar, cuffs and hem and fully fashioned shoulders, neatly folded in a square with the collar and ribbed hem visible. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`isla-cashmere-crewneck-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of an oatmeal cashmere crewneck sweater with ribbed collar, cuffs and hem and fully fashioned shoulders: close-up of the ribbed crew collar and fine knit texture as worn, cropped at the chin, soft light grazing the yarn. No face visible.
```

### Fen Merino Cardigan

**`fen-merino-cardigan-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a sage-green fine merino V-neck cardigan with brown corozo nut buttons and slim rib trims, laid flat, front facing, all buttons fastened. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`fen-merino-cardigan-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a sage-green fine merino V-neck cardigan with brown corozo nut buttons and slim rib trims: close-up of the button placket and V-neck worn over a white Oxford shirt, torso only. No face visible.
```

### Moor Fisherman Rollneck

**`moor-fisherman-rollneck-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a heavyweight undyed ecru Aran cable-knit rollneck sweater with a generous roll collar, neatly folded so the cable pattern and rollneck are visible. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`moor-fisherman-rollneck-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a heavyweight undyed ecru Aran cable-knit rollneck sweater with a generous roll collar: close-up of the chunky Aran cables and rolled collar, textured undyed wool, a hand lightly touching the knit. No face visible.
```

### Ellis Oxford Shirt

**`ellis-oxford-shirt-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a white heavy cotton Oxford button-down shirt with a soft rolled collar, mother-of-pearl buttons and a chest pocket, folded retail-style with collar buttoned, or laid flat front facing. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`ellis-oxford-shirt-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a white heavy cotton Oxford button-down shirt with a soft rolled collar, mother-of-pearl buttons and a chest pocket: close-up of the rolled button-down collar and top buttons as worn, collar open, torso only. No face visible.
```

### Marlow Linen Overshirt

**`marlow-linen-overshirt-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a boxy stone-coloured garment-dyed heavyweight linen overshirt with two chest patch pockets, laid flat, front facing, slightly relaxed with natural linen creases. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`marlow-linen-overshirt-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a boxy stone-coloured garment-dyed heavyweight linen overshirt with two chest patch pockets: a person from shoulders to waist wearing it open over a white tee, sleeves casually rolled, showing the slubby linen texture. No face visible.
```

### Aro Pima Cotton Tee

**`aro-pima-cotton-tee-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a white mid-weight Pima cotton crew-neck t-shirt with a slightly dropped shoulder, laid flat, front facing, perfectly smoothed. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`aro-pima-cotton-tee-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a white mid-weight Pima cotton crew-neck t-shirt with a slightly dropped shoulder: close-up of the neckline and shoulder seam as worn, torso only, showing the smooth jersey texture. No face visible.
```

### Vela Leather Tote

**`vela-leather-tote-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a structured cognac full-grain vegetable-tanned leather tote bag with two top handles and hand-painted edges, standing upright, front facing, handles upright. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`vela-leather-tote-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a structured cognac full-grain vegetable-tanned leather tote bag with two top handles and hand-painted edges: a hand holding the tote by its handles at hip height, close enough to see the leather grain, stitching and painted edges. No face visible.
```

### Nell Crossbody Bag

**`nell-crossbody-bag-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a small oxblood pebbled calf leather crossbody bag with a curved magnetic flap and an adjustable leather strap, standing upright, front facing, strap arranged in a loose curve behind it. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`nell-crossbody-bag-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a small oxblood pebbled calf leather crossbody bag with a curved magnetic flap and an adjustable leather strap: worn across the body against a camel coat, cropped from chest to hip, a hand touching the flap. No face visible.
```

### Rowan Canvas Weekender

**`rowan-canvas-weekender-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of an olive waxed cotton canvas weekender bag with brown bridle leather handles, trim and solid brass hardware, three-quarter front view, handles upright, shoulder strap detached. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`rowan-canvas-weekender-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of an olive waxed cotton canvas weekender bag with brown bridle leather handles, trim and solid brass hardware: close-up of the leather handle, brass fittings and waxed canvas texture, a hand gripping the handles. No face visible.
```

### Orla Gold Hoops

**`orla-gold-hoops-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a pair of chunky tubular 18k gold vermeil hoop earrings, 25 mm diameter, the pair lying flat side by side, slightly overlapping shadows. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`orla-gold-hoops-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a pair of chunky tubular 18k gold vermeil hoop earrings, 25 mm diameter: one hoop worn on an ear, cropped tightly to ear, jaw and neck with hair tucked back, no face. No face visible.
```

### Sable Signet Ring

**`sable-signet-ring-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of an oval sterling silver signet ring with a brushed face and polished band, standing upright at a slight angle so the oval face and band are visible. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`sable-signet-ring-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of an oval sterling silver signet ring with a brushed face and polished band: worn on the little finger of a relaxed hand resting on ivory linen. No face visible.
```

### Lune Pearl Pendant

**`lune-pearl-pendant-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a single baroque freshwater pearl pendant on a fine 18k gold vermeil chain, chain arranged in a soft V shape with the pearl at the bottom. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`lune-pearl-pendant-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a single baroque freshwater pearl pendant on a fine 18k gold vermeil chain: worn at the collarbone against bare skin with an open white shirt collar, cropped below the chin. No face visible.
```

### Wren Cashmere Scarf

**`wren-cashmere-scarf-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a camel woven cashmere scarf with a brushed finish and hand-twisted fringe, neatly folded lengthwise with the fringe visible at one end. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`wren-cashmere-scarf-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a camel woven cashmere scarf with a brushed finish and hand-twisted fringe: draped loosely around the neck and over a charcoal coat, cropped at the chin, showing the brushed texture and fringe. No face visible.
```

### Ashby Leather Belt

**`ashby-leather-belt-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of a chocolate-brown English bridle leather belt, 30 mm wide, with a solid brass roller buckle, coiled neatly with the buckle on top. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`ashby-leather-belt-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of a chocolate-brown English bridle leather belt, 30 mm wide, with a solid brass roller buckle: close-up of the belt worn through the loops of ecru trousers, buckle fastened, hand at the hip. No face visible.
```

### Cato Acetate Sunglasses

**`cato-acetate-sunglasses-1`**: packshot

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Packshot of softly rounded tortoiseshell acetate sunglasses with dark polarised lenses, front view, temples open, placed upright. The whole item is visible and centred with generous margins, with a soft contact shadow. No people.
```

**`cato-acetate-sunglasses-2`**: styled detail

```text
Photoreal e-commerce product photography for a quiet-luxury clothing label. Seamless warm-grey to ivory studio background (#ece6dc), soft diffused daylight from the left, gentle natural shadows, true-to-life colour and fabric texture, high detail, calm and minimal composition. Portrait 4:5 aspect ratio. No text, no logos, no watermarks, no props unless described.
Styled detail shot of softly rounded tortoiseshell acetate sunglasses with dark polarised lenses: the sunglasses folded and resting on a folded ivory knit next to a tan leather case, top-down detail shot. No face visible.
```
