<template>
  <TresInstancedMesh
    v-for="(explosion, i) of explosions"
    ref="instancedMeshesRef"
    :key="i"
    :args="[undefined, undefined, explosion.particles.length]"
    :position="explosion.offset"
    :frustum-culled="false"
    :scale="explosion.scale"
    :user-data="{ surface: ESurfaceType.OTHER }"
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
  import { ESurfaceType, IExplosionData, IParticle } from 'src/definitions';
  import {
    Intersection,
    Matrix4,
    Object3D,
    Object3DEventMap,
    Vector3
  } from 'three';
  import { shallowRef } from 'vue';

  const dummy = new Object3D();

  const instancedMeshesRef = shallowRef<TresObject[]>([]);
  const explosions = shallowRef<IExplosionData[]>([]);

  const getExplosionColor = (surface: ESurfaceType): string => {
    switch (surface) {
      case ESurfaceType.WATER:
        return '#9ea3ac';
      case ESurfaceType.SAND:
        return '#eff69c';
      case ESurfaceType.TARGET:
        return '#ff0000';
      case ESurfaceType.NON_TARGET:
      case ESurfaceType.OTHER:
      default:
        return '#556270';
    }
  };

  const spawnExplosion = (
    target: Intersection<Object3D<Object3DEventMap>>
  ): void => {
    const targetType = target.object.userData.surface ?? ESurfaceType.OTHER;
    explosions.value = [
      ...explosions.value,
      {
        color: getExplosionColor(targetType),
        offset: target.point.clone(),
        particles: getParticles(targetType),
        scale: targetType === ESurfaceType.TARGET ? 0.2 : 0.1,
        time: 0
      }
    ];
  };

  const getParticles = (surface: ESurfaceType): IParticle[] => {
    const amount = surface === ESurfaceType.TARGET ? 20 : 14;
    const size = surface === ESurfaceType.TARGET ? 0.4 : 0.1;

    return Array.from({ length: amount })
      .fill(0)
      .map(() => ({
        dPos: new Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        )
          .normalize()
          .multiplyScalar(size),
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
