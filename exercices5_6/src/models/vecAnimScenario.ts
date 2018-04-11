export interface Bone_Anim{
    bone_Movement: Bone_Movement[];
  }
export interface Scene{
    scene: Bone_Anim[];
  }
export interface Bone_Movement{
    time: number;
    angle_inc: number;
  }
  const Bone0_Anim : Bone_Anim = {
    bone_Movement: [
      {
        time: 0,
        angle_inc: 32
      },
      {
        time: 2,
        angle_inc: 0
      },
      {
        time: 3.5,
        angle_inc: -16
      },
      {
        time:6,
        angle_inc: 0
      }
    ]
  }
  const Bone1_Anim : Bone_Anim = {
    bone_Movement: []
  }
  const Bone2_Anim : Bone_Anim = {
    bone_Movement: []
  }
  const Bone3_Anim : Bone_Anim = {
    bone_Movement: []
  }
  const Bone4_Anim : Bone_Anim = {
    bone_Movement: []
  }
  export const scene_Anim : Scene = {
    scene: [
      Bone0_Anim,
      Bone1_Anim,
      Bone2_Anim,
      Bone3_Anim,
      Bone4_Anim
    ]
  }