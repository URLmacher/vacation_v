<template>
  <Suspense>
    <GLTFModel
      path="/models/doom_2016_pistol.glb"
      :scale="0.1"
      :position="gunPosition"
      :rotation="[0, -3, 0]"
    />
  </Suspense>
  <Suspense>
    <TresMesh ref="muzzleFlashRef" :visible="false">
      <TresSphereGeometry :args="[0.4, 32, 32]" />
      <TresMeshStandardMaterial
        :map="muzzleFlashTexture"
        :transparent="true"
        :emissive="0xffffff"
        :emissiveIntensity="1"
        :opacity="1"
      />
    </TresMesh>
  </Suspense>
</template>

<script setup lang="ts">
  import { GLTFModel } from '@tresjs/cientos';
  import { useTresContext } from '@tresjs/core';
  import gsap from 'gsap';
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
  import { ref, shallowRef } from 'vue';

  const { scene, camera } = useTresContext();

  const emit = defineEmits<{
    'hit:target': [day: ICalendarDisplay];
  }>();

  const gunPosition = ref([-1000, -1000, -1000]);
  const canShoot = ref(true);
  const cooldownTime = 300;
  const impacts: Mesh[] = [];

  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const gunSound = new Audio('/sounds/gun_shoot.mp3');
  const textureLoader = new TextureLoader();
  const bulletHoleTexture = textureLoader.load('/textures/bullet_hole.png');
  const muzzleFlashTexture = textureLoader.load('/textures/flash_shoot.png');
  const muzzleFlashRef = shallowRef<Mesh | undefined>();

  const showMuzzleFlash = (): void => {
    const currentX = gunPosition.value[0];
    const currentY = gunPosition.value[1];
    const currentZ = gunPosition.value[2];
    if (!currentX || !currentY || !currentZ || !muzzleFlashRef.value) return;
    muzzleFlashRef.value.position.set(currentX, currentY, currentZ - 4);
    muzzleFlashRef.value.visible = true;
    setTimeout(() => {
      if (!muzzleFlashRef.value) return;
      muzzleFlashRef.value.visible = false;
    }, 75);
  };

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

  const handleRecoil = (): void => {
    const recoilOffset = 0.1;
    gsap.to(gunPosition.value, {
      duration: 0.05,
      onComplete: () => {
        gsap.to(gunPosition.value, {
          duration: 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            const currentX = gunPosition.value[0];
            const currentY = gunPosition.value[1];
            const currentZ = gunPosition.value[2];
            if (!currentX || !currentY || !currentZ) return;
            gunPosition.value = [currentX, currentY, currentZ - recoilOffset];
          }
        });
      },
      onUpdate: () => {
        const currentX = gunPosition.value[0];
        const currentY = gunPosition.value[1];
        const currentZ = gunPosition.value[2];
        if (!currentX || !currentY || !currentZ) return;
        gunPosition.value = [currentX, currentY, currentZ + recoilOffset];
      }
    });
  };

  const spawnBulletImpact = (
    position: Vector3,
    normal: Vector3,
    object?: Object3D
  ): void => {
    if (!object?.visible || object.userData.isNonTarget) return;

    const impactMaterial = new MeshBasicMaterial({
      depthWrite: false,
      map: bulletHoleTexture,
      transparent: true
    });

    const impactGeometry = new PlaneGeometry(0.5, 0.5);
    const impactMesh = new Mesh(impactGeometry, impactMaterial);

    // Adjust position to avoid hitting the floor
    impactMesh.position.copy(position);

    const up =
      Math.abs(normal.y) > 0.99
        ? new Vector3(1, 0, 0.6) // For vertical surfaces
        : new Vector3(0, 1, 0.6); // For other surfaces

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
    if (!canShoot.value || !camera.value) return;
    canShoot.value = false;
    playGunSound();

    raycaster.setFromCamera(mouse, camera.value);
    showMuzzleFlash();
    handleRecoil();

    const intersects = raycaster.intersectObjects(scene.value.children, true);

    if (intersects.length > 0) {
      const impactPoint = intersects[0]?.point;
      const impactNormal = intersects[0]?.face?.normal;

      if (impactPoint && impactNormal) {
        // Pass the object that was hit to spawnBulletImpact
        spawnBulletImpact(impactPoint, impactNormal, intersects[0]?.object);
        handleTargetHit(intersects);
      }
    }

    setTimeout(() => {
      canShoot.value = true;
    }, cooldownTime);
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
