import { ColaboError, EColaboErrorKind, EErrorOrigin } from './ColaboError'

/**
 * a TypeGuard checking if the `error` is a `ColaboError` (we don't want to use `typeof` or `instanceof`)
 * @param {unknown} error
 * @return {*}  {error is ColaboError}
 */
export const isColaboError = (error: unknown): error is ColaboError => {
    // return error instanceof ColaboError;
    return typeof error === 'object' && error !== null && Object.values(EErrorOrigin).includes((error as ColaboError).origin) && 'kind' in error;
};

/**
 * a TypeGuard checking if the `error` is a `ColaboError` of specific `origin` (we don't want to use `typeof` or `instanceof`)
 * @param {unknown} error
 * @param {EErrorOrigin} originToBeChecked used to check if it is a `ColaboError` of the specific `origin`
 * @return {*}  {error is ColaboError}
 */
export const isColaboErrorOfOrigin = (error: unknown, originToBeChecked: EErrorOrigin): error is ColaboError => {
    // error instanceof ColaboError;
    return typeof error === 'object' && error !== null && (error as ColaboError).origin === originToBeChecked && 'kind' in error;
};

export interface IColaboErrorOptions {
    log?: boolean,
    notify?: boolean,
}

type ThrowArgs = 
  | [error: ColaboError, options?: IColaboErrorOptions]
  | [message: string, origin: EErrorOrigin, kind: string, options?: IColaboErrorOptions, cause?: unknown, description?: string, userMessage?: string, userDescription?: string];

export const createColaboError = (...args: ThrowArgs): ColaboError => {
    let [colaboError, options] = handleColaboErrorCreation(args);
    return processColaboErrorOptions(colaboError, options);
};

export const throwColaboError = (...args: ThrowArgs): never => {
    let [colaboError, options] = handleColaboErrorCreation(args);
    throw processColaboErrorOptions(colaboError, options);
};


export const rethrowColaboError = (error: unknown, options?: IColaboErrorOptions): never => {
    let colaboError: ColaboError = errorToColaboError(error);
    throwColaboError(colaboError, options);
    throw new Error("This should never be reached, but throwing just because of TS error in diagnosing unreachable end");
}

export const errorToColaboError = (error: unknown): ColaboError => {
    let colaboError: ColaboError;
    if(isColaboError(error)) {
        colaboError = error;
    } else if (error instanceof Error) {
        colaboError = createColaboError(error.message, EErrorOrigin.AMBIGUOUS, EColaboErrorKind.UNKNOWN, undefined, error);
    } else {
        colaboError = createColaboError('unknown error', EErrorOrigin.AMBIGUOUS, EColaboErrorKind.UNKNOWN, undefined, error);
    }
    return colaboError;
}

/**
 * used to support overloaded providing of `ColaboError` (by passing of an existing one or creation a new one)
 * @param {ThrowArgs} args
 * @return {*}  {([ColaboError, IColaboErrorOptions | undefined])}
 */
const handleColaboErrorCreation = (args: ThrowArgs): [ColaboError, IColaboErrorOptions | undefined] => {
    let options: IColaboErrorOptions | undefined;
    let colaboError: ColaboError;
    if (args[0] instanceof ColaboError && args.length === 1 || args.length === 2) {
        // it's overload #1: If the first argument is a ColaboError, so throw it directly
        [colaboError, options] = args;
    } else if (typeof args[0] === 'string' && args.length >= 3) {
        // it's overload #2, Otherwise, so we construct a new ColaboError with the provided arguments and throw it
        // console.log("handleColaboErrorCreation", args);
        const [message, originPar, kind, optionsPar, cause, description, userMessage, userDescription] = args;
        const origin: EErrorOrigin = originPar as EErrorOrigin;
        options = optionsPar;
        colaboError = new ColaboError(message, origin, kind as string, cause, description, userMessage, userDescription);
    } else {
        // no overload found:
        try {
            colaboError = new ColaboError('Invalid arguments provided to throwColaboError', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, undefined, JSON.stringify(args), );
        } catch(ex) {
            colaboError = new ColaboError('Invalid arguments provided to throwColaboError', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, ex);
        }
    }
    return [colaboError, options];
}

export const processColaboErrorOptions: {
    (colaboError: ColaboError, options?: IColaboErrorOptions): ColaboError;
    (colaboError: ColaboError, enforce: boolean): ColaboError;
} = (colaboError: ColaboError, secondParam: IColaboErrorOptions | undefined | boolean): ColaboError => {
    try {
        let options: IColaboErrorOptions | undefined;
        if(typeof secondParam === "boolean") {
            options = {log: true, notify: true};
        }
        else {
            options = secondParam;
        }
        if(options) {
            if(options.log && !colaboError.colaboErrorManagementState.isLogged) {
                // TODO-ColaboError: do logging and take in mind that it may throw error itself, in that case provide a graceful logging:
                console.error("[ColaboError] ", colaboError.toJSON());
                // if the above logging action fails, `isLogged` will keep being `false` so the caller will know it is NOT logged:
                colaboError.colaboErrorManagementState.isLogged = true;
            }
            if(options.notify && !colaboError.colaboErrorManagementState.isNotified) {
                // TODO-ColaboError:
                // TODO notifying ..
                // if the above notifying action fails, `isNotified` will keep being `false` so the caller will know it is NOT notified:
                colaboError.colaboErrorManagementState.isNotified = true;
            }
        }
    } catch (errorInOptionsProcessing) {
        // TODO: check of the current approach where, instead of throwing a new ColaboError informing of `errorInOptionsProcessing` like in the below-block /* ... */
        // TODO ... and instead we have thrown the original `ColaboError` (so that the caller is aware of the original error), while its `colaboErrorManagementState` will keep track of the `errorInOptionsProcessing` failure.
        // TODO ... still we should make some approach in compositing these two errors.
        /*

        // let errorDetails: string;
        // try {
        //     errorDetails = JSON.stringify(colaboError);
        // } catch (error) {
        //     // Simplified fallback if JSON.stringify fails
        //     errorDetails = `kind=${colaboError.kind}, message=${colaboError.message}`;
        // }

        TODO: instead of overwriting the original`ColaboError`! and adding it as a `cause` of new error, maybe we should have enhanced it (the original ColaboError) with the new data!:
        TODO: should we keep the original `ColaboError` so that the caller know what happened, but maybe not being aware of 
        colaboError = new ColaboError('Error in processing ColaboError options', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, colaboError);

        */
        return colaboError;
    }
    return colaboError;
}

// export const createColaboErrorOriginal: {
//     (error: ColaboError, options?: IColaboErrorOptions): ColaboError;
//     (message: string, origin: EErrorOrigin, kind: EColaboErrorKind, options?: IColaboErrorOptions, cause?: unknown, description?: string, userMessage?: string, userDescription?: string): ColaboError;
// } = (...args: ThrowArgs): ColaboError  => {
//     let options: IColaboErrorOptions;
//     let colaboError: ColaboError;
//     if (args[0] instanceof ColaboError && args.length === 1 || args.length === 2) {
//         // it's overload #1: If the first argument is a ColaboError, so throw it directly
//         [colaboError, options] = args;
//     } else if (typeof args[0] === 'string' && args.length >= 3) {
//         // it's overload #2, Otherwise, so we construct a new ColaboError with the provided arguments and throw it
//         const [message, originPar, kind, optionsPar, cause, description, userMessage, userDescription] = args;
//         const origin: EErrorOrigin = originPar as EErrorOrigin;
//         options = optionsPar;
//         colaboError = new ColaboError(message, origin, kind, cause, description, userMessage, userDescription);
//     } else {
//         // no overload found:
//         try {
//             colaboError = new ColaboError('Invalid arguments provided to throwColaboError', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, undefined, JSON.stringify(args), );
//         } catch(ex) {
//             colaboError = new ColaboError('Invalid arguments provided to throwColaboError', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, ex);
//         }
//     }
//     try {
//         if(options) {
//             if(options.log) {
//                 // TODO-ColaboError: do logging and take in mind that it may throw error itself, in that case provide a graceful logging:
//                 console.error(JSON.stringify(colaboError));
//                 // if the above logging action fails, `isLogged` will keep being `false` so the caller will know it is NOT logged:
//                 colaboError.colaboErrorManagementState.isLogged = true;
//             }
//             if(options.notify) {
//                 // TODO-ColaboError:
//                 // TODO notifying ..
//                 // if the above notifying action fails, `isNotified` will keep being `false` so the caller will know it is NOT notified:
//                 colaboError.colaboErrorManagementState.isNotified = true;
//             }
//         }
//     } catch (errorInOptionsProcessing) {
//         // TODO: check of the current approach where, instead of throwing a new ColaboError informing of `errorInOptionsProcessing` like in the below-block /* ... */
//         // TODO ... and instead we have thrown the original `ColaboError` (so that the caller is aware of the original error), while its `colaboErrorManagementState` will keep track of the `errorInOptionsProcessing` failure.
//         // TODO ... still we should make some approach in compositing these two errors.
//         /*

//         // let errorDetails: string;
//         // try {
//         //     errorDetails = JSON.stringify(colaboError);
//         // } catch (error) {
//         //     // Simplified fallback if JSON.stringify fails
//         //     errorDetails = `kind=${colaboError.kind}, message=${colaboError.message}`;
//         // }

//         TODO: instead of overwriting the original`ColaboError`! and adding it as a `cause` of new error, maybe we should have enhanced it (the original ColaboError) with the new data!:
//         TODO: should we keep the original `ColaboError` so that the caller know what happened, but maybe not being aware of 
//         colaboError = new ColaboError('Error in processing ColaboError options', EErrorOrigin.SYSTEM, EColaboErrorKind.COLABO_ERROR_INTERNAL, colaboError);

//         */
//         return colaboError;
//     }
// }