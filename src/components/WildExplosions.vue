<template>
  <TresInstancedMesh
    v-for="(explosion, i) of explosions"
    ref="instancedMeshesRef"
    :key="i"
    :args="[undefined, undefined, explosion.particles.length]"
    :position="explosion.offset"
    :frustum-culled="false"
    :scale="0.2"
    :user-data="{ isNonTarget: true }"
  >
    <TresDodecahedronGeometry :args="[10, 0]" />
    <TresMeshStandardMaterial
      :color="explosion.color"
      :emissive="explosion.color"
      :emissiveIntensity="2"
      :transparent="true"
      :depthWrite="false"
      :opacity="1"
    />
  </TresInstancedMesh>
</template>

<script setup lang="ts">
  import { TresObject, useLoop } from '@tresjs/core';
  import { IExplosionData, IParticle } from 'src/definitions';
  import { Matrix4, Object3D, Vector3 } from 'three';
  import { shallowRef } from 'vue';

  const dummy = new Object3D();

  const instancedMeshesRef = shallowRef<TresObject[]>([]);
  const explosions = shallowRef<IExplosionData[]>([]);

  const spawnExplosion = (targetPosition: Vector3): void => {
    explosions.value = [
      ...explosions.value,
      {
        color: '#ff6600',
        offset: targetPosition.clone(),
        particles: getParticles(),
        time: 0
      }
    ];
  };

  const getParticles = (): IParticle[] => {
    return Array.from({ length: 20 })
      .fill(0)
      .map(() => ({
        dPos: new Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        )
          .normalize()
          .multiplyScalar(0.2),
        position: new Vector3()
      }));
  };

  const updateExplosion = (): void => {
    if (!Array.isArray(instancedMeshesRef.value)) return;

    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);
    const m = new Matrix4();
    let i = 0;

    for (const instancedMesh of instancedMeshesRef.value) {
      const explosion = explosions.value?.[i];

      explosion?.particles.forEach((particle, ii) => {
        (particle.position as Vector3).add(particle.dPos);
        dummy.position.copy(particle.position);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(ii, dummy.matrix);
        if (ii === 0 && i === 0) {
          instancedMesh.getMatrixAt(ii, m);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
      });
      instancedMesh.material.opacity = Math.max(
        0,
        instancedMesh.material.opacity - 0.025
      );
      i++;
    }
  };

  useLoop().onBeforeRender(updateExplosion);

  defineExpose({
    spawnExplosion
  });
</script>
