# Screenforge

Screenforge is a static 3D device mockup tool. Drop a PNG, JPG, or WebP screenshot into the browser, choose a device model, tune the studio lighting and background, save local pictures, then export the canvas as a PNG.

Images stay local in the browser. There is no backend and no server upload. Saved pictures are stored in this browser with IndexedDB, which is the browser storage layer suited for image-sized data.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vite config uses `base: './'` so the build can run from GitHub Pages project paths. If you deploy at a fixed root path and prefer absolute asset URLs, change `base` in `vite.config.ts`.

## GitHub Pages

This repo includes `.github/workflows/pages.yml`. Push to `main`, enable GitHub Pages with the source set to GitHub Actions, and the workflow will run:

- `npm ci`
- `npm test`
- `npm run lint`
- `npm run build`
- deploy `dist`

The app is fully static and does not need a backend service.

## Browser Tools

- Drag-and-drop or file picker upload for PNG, JPG, and WebP.
- Cover/contain screen fitting.
- Background presets plus color picker.
- Lighting, key-light, ambient, shadow, softness, zoom, auto-rotate, and screen glow controls.
- Copy PNG to clipboard when the browser supports image clipboard writes.
- Save picture to the local browser library.
- Download saved pictures later from the local library.

## Model Assets

Runtime models live in `public/models` and are loaded by the centralized registry in `src/config/devices.ts`.

Current mappings:

- `/models/iphone-15-pro.glb`
- `/models/iphone-16-plus-blue.usdz`
- `/models/iphone-16-pro-max.glb`
- `/models/iphone-16-pro-max-light-brown.usdz`
- `/models/iphone-17-pro.glb`
- `/models/iphone-air.usdz`
- `/models/macbook-neo.glb`
- `/models/macbook-pro-14-inch-m5.glb`
- `/models/silver-apple-ipad-13-pro-m4.glb`

## Add Or Tune A Device

1. Place the `.glb` or `.usdz` file in `public/models`.
2. Add a new entry to `DEVICE_CONFIGS` in `src/config/devices.ts`.
3. Tune `initialRotation`, `cameraDistance`, and `fallbackScreen`.
4. Prefer model mesh or material names that include `screen`, `display`, `glass`, `monitor`, or `lcd`. Screenforge tries those first and only uses the fallback plane when it cannot find a usable screen mesh.
5. Run `npm test`, `npm run lint`, and `npm run build`.

## Project Structure

- `src/components/DeviceScene.tsx` controls the R3F canvas, camera, lighting, shadows, and backgrounds.
- `src/components/DeviceModel.tsx` loads GLB/USDZ assets and applies the uploaded screenshot to screen meshes or fallback planes.
- `src/components/UploadDropzone.tsx` handles drag-and-drop and file picker input.
- `src/components/ControlPanel.tsx` contains device, background, lighting, camera, and export controls.
- `src/config/devices.ts` is the model registry and per-device fallback screen tuning.
