export const throttle = (callback: (...args: any) => any, throttleTime: number = 10) => {
    let wait = false;
    return () => {
        if (!wait) {
            callback();
            wait = true;
            setTimeout(
                () => wait = false,
                throttleTime,
            );
        }
    };
};
