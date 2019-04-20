function getImage(imgUrl: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
        let img = new Image();
        img.src = imgUrl;
        img.onload = () => resolve(img);
    });
}

export async function createPin(pin: string): Promise<google.maps.Icon> {
    const img: HTMLImageElement = await getImage(pin);

    let height = img.height;
    let width = img.width;

    if (img.height > 100 || img.width > 100) {
        height = height * (32.0 / width);
        width = 32;
    }

    return {
        url: pin,
        anchor: new google.maps.Point(width / 2, height),
        scaledSize: new google.maps.Size(width, height)
    };
}
