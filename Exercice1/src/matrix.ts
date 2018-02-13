import { Vector } from './vec';

export class Matrix {
  static identity(): Matrix {
  return new Matrix(
  [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1]
  ]);
  }

  static fromScale(sx: number, sy: number, sz: number): Matrix {
    return new Matrix(
      [
        [sx,0,0,0],
        [0,sy,0,0],
        [0,0,sz,0],
        [0,0,0,1]
      ]
    );
  }

  static fromPitch(rad: number): Matrix {
    return new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(rad), -Math.sin(rad), 0],
      [0, Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 0, 1]
    ]);
  }

  static fromYaw(rad: number): Matrix {
    return new Matrix([
      [Math.cos(rad), 0, Math.sin(rad), 0],
      [0, 1, 0, 0],
      [-Math.sin(rad), 0, Math.cos(rad), 0],
      [0, 0, 0, 1]
    ]);
  }

  static fromRoll(rad: number): Matrix {
    return new Matrix([
      [Math.cos(rad), -Math.sin(rad), 0, 0],
      [Math.sin(rad), Math.cos(rad), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  }

  static fromTranslation(dx: number, dy: number, dz: number): Matrix {
    return new Matrix(
      [
        [1,0,0,dx],
        [0,1,0,dy],
        [0,0,1,dz],
        [0,0,0,1]
      ]);
  }

  constructor(public M : number[][] = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]) {
  }

  mul<T extends Vector | Matrix>(other: T): T {
    if (other instanceof Vector) {
      return <T> this.mulVector(other);
    }
    if (other instanceof Matrix) {
      return <T> this.mulMatrix(other);
    }
  }

  private mulVector(v: Vector): Vector {
    return new Vector(
      (this.M[0][0]*v.x)+(this.M[0][1]*v.y)+(this.M[0][2]*v.z)+(this.M[0][3]*1),
      (this.M[1][0]*v.x)+(this.M[1][1]*v.y)+(this.M[1][2]*v.z)+(this.M[1][3]*1),
      (this.M[2][0]*v.x)+(this.M[2][1]*v.y)+(this.M[2][2]*v.z)+(this.M[2][3]*1)
    );
  }

  private mulMatrix(m: Matrix): Matrix {
    var matrix = new Matrix;
    for(var i =0;i<4;i++){
      for(var j =0;j<4;j++){
        matrix.M[i][j] = this.M[i][0]*m.M[0][j]+
        this.M[i][1]*m.M[1][j]+
        this.M[i][2]*m.M[2][j]+
        this.M[i][3]*m.M[3][j];
      }
    }
    return matrix;
  }
  Transpose(): Matrix{
    var matrix = new Matrix([
      [this.M[0][0],this.M[1][0], this.M[2][0], this.M[3][0]],
      [this.M[0][1],this.M[1][1],this.M[2][1],this.M[3][1]],
      [this.M[0][2],this.M[1][2],this.M[2][2],this.M[3][2]],
      [this.M[0][3],this.M[1][3],this.M[2][3],this.M[3][3]]
    ]);
    return matrix;
  }
  //Créé une sous-matrice de la matrice mère en retirant les cellules de la même rangée et colonne que le pivot (X, Y)
    TruncateMatrix(X:number, Y:number) : Matrix{
    var Size: number = this.M.length;
    var CptX: number = 0, CptY: number = 0;
    var NewMatrix:Matrix = Matrix.InitMatrix(Size-1);
    for(var i = 0; i < Size; i++){
      if(i != X){
        for(var j = 0; j < Size; j++){
          if(j != Y){
            NewMatrix.M[CptX][CptY] = this.M[i][j];
            CptY++;
          }
        }
        CptX++;
        CptY=0;
      }
    }
    return NewMatrix;
  }
  //créé une matrice Size x Size
  static InitMatrix(Size: number):Matrix{
    var NewMatrix : number[][] = [];
    
    
    for(var a = 0; a < (Size); a++){
      let initarray: number[] = [];
      for(var b = 0; b < (Size); b++){
        initarray.push(0);
      }
      NewMatrix.push(initarray);
    }
    return new Matrix(NewMatrix);
  }
  //calcule le déterminant de la matrice
  Determinant():number{
    var Addition:boolean = true;
    var Sum:number = 0;
    var TruncMatrix: Matrix;
    if(this.M.length <= 2){ //puisque c'est et sera toujours une matrice carrée, on n'a pas besoin de mesurer l'autre taille.
      return (this.M[0][0]*this.M[1][1])-(this.M[1][0]*this.M[0][1]);
    }
    else{
      for(var j = 0; j < this.M.length; j++){
        TruncMatrix = this.TruncateMatrix(0, j);
        if(Addition){
          Sum = Sum + (this.M[0][j] * TruncMatrix.Determinant());
          Addition = !Addition;
        }
        else{
          Sum = Sum - (this.M[0][j] * TruncMatrix.Determinant());
          Addition = !Addition;
        }
      }
      return Sum;
    }
  }
  inverse(): Matrix {
    if(this.M.length == this.M[0].length){
      var detM: number = this.Determinant();
      if(detM != 0){
        var InvDetM: number = 1 / detM;
        var Sign: number = 1;
        var CofactorM = new Matrix();
        var TruncateMatrix: Matrix;
        for(var i = 0; i<this.M.length; i++){
          for(var j = 0; j<this.M.length; j++){
            TruncateMatrix = this.TruncateMatrix(i, j);
            CofactorM.M[i][j] = Sign * TruncateMatrix.Determinant() * InvDetM;
            Sign = Sign * -1;
          }
          if(this.M.length % 2 == 0) //si la matrice est de taille paire, inverse le signe ([+,-][+,-] => [+,-][-,+])
          Sign = Sign * -1;
        }
        return CofactorM.Transpose();
      }
      else{
        console.log("Matrice non-inversible : Déterminant = 0");
        return null;
      }
    }
    else{
      console.log("Matrice non-inversible : Matrice non-carrée");
      return null;
    }
  }
}