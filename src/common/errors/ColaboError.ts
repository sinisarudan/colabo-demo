export enum EErrorOrigin {
  /** error that ocurred as part of unepxected system behaviour, its malfunctioning, something anticipated as a regular use case
   * @example `CONNECTION_ERROR`, `DB_ERROR`
   */
  SYSTEM = 'SYSTEM',
  /** error that is a part of regular business logics a part of domain, anticipated in use cases
   * @example `PERMISSION_DENIED`, `CREDIT_INSUFFICIENT`
   */
  DOMAIN = 'DOMAIN',
  /** ambiguous if it is a SYSTEM or DOMAIN error */
  AMBIGUOUS = 'AMBIGUOUS',
}

// TODO: to see where to define specific `kind`'s for different cases
/**
 * generic, generally used `kind`s
 */
export enum EColaboErrorKind {
  DATA_MISSING = 'DATA_MISSING',
  DATA_INCORRECT_FORMAT = 'DATA_INCORRECT_FORMAT',
  REQUEST_BAD = 'REQUEST_BAD',
  INPUT_INCORRECT = 'INPUT_INCORRECT',
  DB_ERROR = 'DB_ERROR',
  COLABO_ERROR_INTERNAL = 'COLABO_ERROR_INTERNAL',
  UNKNOWN = 'UNKNOWN',
}

export const ColaboErrorName: string = 'ColaboError';

export interface IColaboErrorManagementState {
  /** telling if the `ColaboError` is logged. It is used to prevent double logging and missing to log */
  isLogged: boolean;
  /** telling if a system user is notified of `ColaboError`. It is used to prevent double notifying and missing to notify */
  isNotified: boolean;
}

export class ColaboError extends Error {
  //TODO -> @mprinc: will we make all properties a part of an object in `ColaboError` to be easily bumped into serialized objects
  //TODO ... or maybe better will we introduce serialization method?

  /** error code */
  public origin: EErrorOrigin;

  /** error code (intentionally not enforced to be one of `EColaboErrorKind` */
  public kind: string;

  /** message intended for user (compared to `Error`.`message` intended for system logging/monitoring */
  public userMessage?: string;

  /** detailed description of error */
  public description?: string;

  /** detailed description intended for user */
  public userDescription?: string;

  /** the moment of error creation */
  public timestamp?: Date;

  /**
   * TODO: a workaround for <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause>
   * until we update TS to support it in the format `throw new Error("Connecting to database failed.", { cause: err });`
   * `tsconfig.json` holds `"target": "es6"`, => ECMAScript 2015 (also known as ES6) standard.
   * while we would need `"target": "ESNext", // or "ES2022"`
   */
  public cause: unknown;

  /**
   * state of ColaboError, used by ColaboError Management
   * @type {IColaboErrorManagementState}
   * @memberof ColaboError
   */
  public colaboErrorManagementState: IColaboErrorManagementState;

  // TODO: Add commentary
  public constructor(
    message: string,
    origin: EErrorOrigin,
    kind: string,
    cause?: unknown,
    description?: string,
    userMessage?: string,
    userDescription?: string,
  ) {
    // TODO: we use `this.cause` until we'll be able to use `super(message, {cause: cause});` in the updated TS version
    super(message);
    this.message = message;
    //TODO: `Error.name` is used in TS as a discriminator of Error extended from `Error`. Thus the current setting to `this.name = ColaboErrorName;` is correct usage. Yet we might use it instead of `kind` or as its mirror, depending on which level we want `name` to discriminate the error:
    this.name = ColaboErrorName;
    this.origin = origin;
    this.kind = kind;
    this.timestamp = new Date();
    this.description = description;
    this.userMessage = userMessage;
    this.userDescription = userDescription;
    this.cause = cause;
    this.colaboErrorManagementState = { isLogged: false, isNotified: false };

    // console.log("ColaboError constructor", this.toString());

    /*
     * // TODO should we set (to simplify usage):
     * this.userDescription = this.description;
     * this.userMessage = this.message;
     * or leave it undefined to be sure that the messages are NOT intended for user?
     */
  }

  public toString(): string {
    const errorInfo = {
      ...this, // Spread the existing properties
      // Explicitly include inherited properties `message` and `stack`:
      message: this.message,
      stack: this.stack,
    };

    return '[ColaboError] ' + JSON.stringify(errorInfo, null, 4);
  }

  public toJSON() {
    const JSONObj: { [key: string]: any } = Object.getOwnPropertyNames(
      this,
    ).reduce(
      (acc, key) => {
        // `this[key]` accesses the property value of `key` on the instance
        acc[key] = (this as any)[key];
        return acc;
      },
      {} as { [key: string]: any },
    );
    // console.log("[ColaboError:toJSON] ", JSONObj)
    return JSONObj;
  }
}
