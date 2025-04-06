<!-- <template></template> -->

<script setup lang="ts">
  import { useTresContext } from '@tresjs/core';
  import { EquirectangularReflectionMapping } from 'three';
  import { EXRLoader } from 'three/examples/jsm/Addons.js';
  import { onMounted } from 'vue';

  const { scene } = useTresContext();

  onMounted(async () => {
    const loader = new EXRLoader();
    const texture = await loader.loadAsync(
      '/textures/evening_road_01_puresky_4k.exr'
    );

    texture.mapping = EquirectangularReflectionMapping;
    scene.value.background = texture;
    scene.value.environment = texture;
  });
</script>
