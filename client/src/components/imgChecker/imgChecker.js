export function IsImageOk(img) {

    if (!img.complete) {
        return false;
    }

    if (img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}