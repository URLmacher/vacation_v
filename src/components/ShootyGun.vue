<template>
  <Suspense>
    <GLTFModel
      path="/models/doom_2016_pistol.glb"
      :scale="0.1"
      :position="gunPosition"
      :rotation="[0, -3, 0]"
    />
  </Suspense>
</template>

<script setup lang="ts">
  import { GLTFModel } from '@tresjs/cientos';
  import { useTresContext } from '@tresjs/core';
  import { ICalendarDisplay } from 'src/definitions';
  import {
    Intersection,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Object3DEventMap,
    PlaneGeometry,
    Quaternion,
    Raycaster,
    TextureLoader,
    Vector2,
    Vector3
  } from 'three';
  import { ref } from 'vue';

  const { scene, camera } = useTresContext();

  const emit = defineEmits<{
    'hit:target': [day: ICalendarDisplay];
  }>();

  const gunPosition = ref([-1000, -1000, -1000]);
  const impacts: Mesh[] = [];

  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const gunSound = new Audio('/sounds/gun_shoot.mp3');
  const textureLoader = new TextureLoader();
  const bulletHoleTexture = textureLoader.load('/textures/bullet_hole.png');

  const playGunSound = async (): Promise<void> => {
    gunSound.volume = 0.2;
    gunSound.pause();
    gunSound.currentTime = 0;
    gunSound.play();
    await gunSound.play();
  };

  const removeBulletHoles = (): void => {
    impacts.forEach((impactMesh) => {
      scene.value.remove(impactMesh);
      impactMesh.geometry.dispose();
    });
  };

  const spawnBulletImpact = (position: Vector3, normal: Vector3): void => {
    const impactMaterial = new MeshBasicMaterial({
      depthWrite: false,
      map: bulletHoleTexture,
      transparent: true
    });
    const impactGeometry = new PlaneGeometry(0.5, 0.5);
    const impactMesh = new Mesh(impactGeometry, impactMaterial);

    impactMesh.position.copy(position);

    const up =
      Math.abs(normal.y) > 0.99
        ? new Vector3(1, 0, 0.5)
        : new Vector3(0, 1, 0.5);

    const quaternion = new Quaternion().setFromUnitVectors(up, normal);
    impactMesh.quaternion.copy(quaternion);

    scene.value.add(impactMesh);
    impacts.push(impactMesh);
  };

  const handleTargetHit = (
    intersects: Intersection<Object3D<Object3DEventMap>>[]
  ): void => {
    const hitTarget = intersects.find(
      (intersect) => intersect.object.userData.isVacationDay
    );
    if (hitTarget) {
      emit('hit:target', hitTarget.object.userData as ICalendarDisplay);
      return;
    }
  };

  const handleShoot = (): void => {
    if (!camera.value) return;
    playGunSound();

    raycaster.setFromCamera(mouse, camera.value);

    // Check for intersections with objects in the scene
    const intersects = raycaster.intersectObjects(scene.value.children, true);

    if (intersects.length > 0) {
      const impactPoint = intersects[0]?.point;
      const impactNormal = intersects[0]?.face?.normal;
      if (impactPoint && impactNormal) {
        spawnBulletImpact(impactPoint, impactNormal);
        handleTargetHit(intersects);
      }
    }
  };

  const showGun = (): void => {
    gunPosition.value = [1, -1.75, -2];
  };

  defineExpose({
    handleShoot,
    removeBulletHoles,
    showGun
  });
</script>
