import { BaseObject } from '../core/base-object';
import { Armature } from './armature';
import { Matrix } from '../geom/matrix';
import { Transform } from '../geom/transform';
import { Point } from '../geom/point';
/**
 * - The base class of the transform object.
 * @see dragonBones.Transform
 * @version DragonBones 4.5
 * @language en_US
 */
/**
 * - 变换对象的基类。
 * @see dragonBones.Transform
 * @version DragonBones 4.5
 * @language zh_CN
 */
export abstract class TransformObject extends BaseObject {
  protected static readonly _helpMatrix: Matrix = new Matrix();
  protected static readonly _helpTransform: Transform = new Transform();
  protected static readonly _helpPoint: Point = new Point();
  protected _globalDirty: boolean;
  /**
   * - The armature to which it belongs.
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - 所属的骨架。
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public get armature(): Armature {
    return this._armature;
  }
  /**
   * - A matrix relative to the armature coordinate system.
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - 相对于骨架坐标系的矩阵。
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public readonly globalTransformMatrix: Matrix = new Matrix();
  /**
   * - A transform relative to the armature coordinate system.
   * @see #updateGlobalTransform()
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - 相对于骨架坐标系的变换。
   * @see #updateGlobalTransform()
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public readonly global: Transform = new Transform();
  /**
   * - The offset transform relative to the armature or the parent bone coordinate system.
   * @see #dragonBones.Bone#invalidUpdate()
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - 相对于骨架或父骨骼坐标系的偏移变换。
   * @see #dragonBones.Bone#invalidUpdate()
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public readonly offset: Transform = new Transform();
  /**
   * @private
   */
  public origin: Transform | null;
  /**
   * @private
   */
  public userData: any;
  /**
   * @internal
   */
  public _alpha: number;
  /**
   * @internal
   */
  public _globalAlpha: number;
  /**
   * @internal
   */
  public _armature: Armature;
  /**
   * - For performance considerations, rotation or scale in the {@link #global} attribute of the bone or slot is not always properly accessible,
   * some engines do not rely on these attributes to update rendering, such as Egret.
   * The use of this method ensures that the access to the {@link #global} property is correctly rotation or scale.
   * @example
   * <pre>
   *     bone.updateGlobalTransform();
   *     let rotation = bone.global.rotation;
   * </pre>
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - 出于性能的考虑，骨骼或插槽的 {@link #global} 属性中的旋转或缩放并不总是正确可访问的，有些引擎并不依赖这些属性更新渲染，比如 Egret。
   * 使用此方法可以保证访问到 {@link #global} 属性中正确的旋转或缩放。
   * @example
   * <pre>
   *     bone.updateGlobalTransform();
   *     let rotation = bone.global.rotation;
   * </pre>
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public updateGlobalTransform(): void {
    if (this._globalDirty) {
      this._globalDirty = false;
      this.global.fromMatrix(this.globalTransformMatrix);
    }
  }
  /**
   */
  protected _onClear(): void {
    this.globalTransformMatrix.identity();
    this.global.identity();
    this.offset.identity();
    this.origin = null;
    this.userData = null;

    this._globalDirty = false;
    this._alpha = 1.0;
    this._globalAlpha = 1.0;
    this._armature = null as any; //
  }
}