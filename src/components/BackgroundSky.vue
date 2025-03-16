<!-- <template></template> -->

<script setup lang="ts">
  import { useTresContext } from '@tresjs/core';
  import { onMounted } from 'vue';
  import { PMREMGenerator } from 'three';
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

  const { renderer, scene } = useTresContext();

  onMounted(() => {
    const loader = new RGBELoader();
    loader.load(
      '/textures/kloofendal_overcast_puresky_2k.hdr',
      (texture) => {
        const pmremGenerator = new PMREMGenerator(renderer.value);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.value.environment = envMap;
        scene.value.background = texture;

        texture.dispose();
        pmremGenerator.dispose();
      }
    );
  });
</script>
