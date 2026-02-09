# 3D Design & Blender Guide

Since this is a web-based environment, I cannot install desktop software like Blender directly on your machine. However, this guide will help you install Blender and set up your workflow to create amazing 3D assets for your new website.

## 1. Installing Blender
1.  Go to [blender.org/download](https://www.blender.org/download/).
2.  Download the latest stable version for Windows.
3.  Run the installer and follow the on-screen instructions.

## 2. Creating 3D Assets for the Web
When designing for the web (Three.js/React Three Fiber), keep these optimization tips in mind:

### Geometry
*   **Low Poly**: Keep your polygon count reasonable (under 100k triangles per object is a good rule of thumb for smooth web performance).
*   **Modifiers**: Apply all modifiers (like Mirror, Subdivision Surface) before exporting, unless you are baking them.
*   **Origin Point**: Set the origin point to the center of the object (or bottom center for floor objects) to make positioning easier in code.

### Materials & Textures
*   **PBR Materials**: Use the Principled BSDF node in Blender. It translates perfectly to standard standard web materials.
*   **Texture Size**: Use 1024x1024 or 2048x2048 textures. JPG for opaque textures, PNG for transparent ones.
*   **Baking**: For complex lighting or procedural textures, "bake" them into image textures.

## 3. Exporting for the Web (glTF/GLB)
The industry standard for 3D on the web is **glTF**.

1.  Select the objects you want to export.
2.  Go to **File > Export > glTF 2.0 (.glb/.gltf)**.
3.  **Settings**:
    *   **Include > Limit to Selected Objects**: Check this box.
    *   **Transform > +Y Up**: Ensure this is checked (Three.js uses Y-up).
    *   **Mesh > Compression**: If available, use Draco compression for smaller file sizes (requires DracoLoader in code).
4.  Save the file as a `.glb` (binary, single file) is usually best.

## 4. Importing into Your Project
1.  **Save File**: Place your `.glb` file in the `client/public/models/` folder (create this folder if it doesn't exist).
2.  **Load in React**:
    Use the `useGLTF` hook from `@react-three/drei`.

    ```jsx
    import { useGLTF } from '@react-three/drei';

    export function MyModel() {
      const { scene } = useGLTF('/models/my-design.glb');
      return <primitive object={scene} scale={1} />;
    }
    ```

## 5. Next Steps
*   Open Blender and start modeling your "Dream House" or "Furniture".
*   Export it as `house.glb`.
*   Place it in your project and view it using the `ModelViewer` page!
