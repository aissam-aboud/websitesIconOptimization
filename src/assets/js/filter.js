var filter = {
    
    filterColor : '',
    tolerance : 1,
    invertRange : [0, 1],
    invertStep : 0.1,
    sepiaRange : [0, 1],
    sepiaStep : 0.1,
    saturateRange : [5, 100],
    saturateStep : 5,
    hueRotateRange : [0, 360],
    hueRotateStep : 5,
    possibleColors : null,
    style: '',
    iconPosition: '',
    finalData: {},

    sepiaMatrix(s) {
        return [
            (0.393 + 0.607 * (1 - s)), (0.769 - 0.769 * (1 - s)), (0.189 - 0.189 * (1 - s)),
            (0.349 - 0.349 * (1 - s)), (0.686 + 0.314 * (1 - s)), (0.168 - 0.168 * (1 - s)),
            (0.272 - 0.272 * (1 - s)), (0.534 - 0.534 * (1 - s)), (0.131 + 0.869 * (1 - s)),
        ]
    },
    saturateMatrix(s) {
        return [
            0.213+0.787*s, 0.715-0.715*s, 0.072-0.072*s,
            0.213-0.213*s, 0.715+0.285*s, 0.072-0.072*s,
            0.213-0.213*s, 0.715-0.715*s, 0.072+0.928*s,
        ]
    },
    hueRotateMatrix(d) {
        var cos = Math.cos(d * Math.PI / 180);
        var sin = Math.sin(d * Math.PI / 180);
        var a00 = 0.213 + cos*0.787 - sin*0.213;
        var a01 = 0.715 - cos*0.715 - sin*0.715;
        var a02 = 0.072 - cos*0.072 + sin*0.928;

        var a10 = 0.213 - cos*0.213 + sin*0.143;
        var a11 = 0.715 + cos*0.285 + sin*0.140;
        var a12 = 0.072 - cos*0.072 - sin*0.283;

        var a20 = 0.213 - cos*0.213 - sin*0.787;
        var a21 = 0.715 - cos*0.715 + sin*0.715;
        var a22 = 0.072 + cos*0.928 + sin*0.072;
                
        return [
            a00, a01, a02,
            a10, a11, a12,
            a20, a21, a22,
        ]
    },
    clamp(value) {
        return value > 255 ? 255 : value < 0 ? 0 : value;
    },
    filter(m, c) {
        return [
            this.clamp(m[0]*c[0] + m[1]*c[1] + m[2]*c[2]),
            this.clamp(m[3]*c[0] + m[4]*c[1] + m[5]*c[2]),
            this.clamp(m[6]*c[0] + m[7]*c[1] + m[8]*c[2]),
        ]
    },
    invertBlack(i) {
        return [
            i * 255,
            i * 255,
            i * 255,
        ]
    },
    generateColors() {
        this.possibleColors = [];
        let invert = this.invertRange[0];
        for (invert; invert <= this.invertRange[1]; invert+=this.invertStep) {
            let sepia = this.sepiaRange[0];
            for (sepia; sepia <= this.sepiaRange[1]; sepia+=this.sepiaStep) {
                let saturate = this.saturateRange[0];
                for (saturate; saturate <= this.saturateRange[1]; saturate+=this.saturateStep) {
                    let hueRotate = this.hueRotateRange[0];
                    for (hueRotate; hueRotate <= this.hueRotateRange[1]; hueRotate+=this.hueRotateStep) {
                        let invertColor = this.invertBlack(invert);
                        let sepiaColor = this.filter(this.sepiaMatrix(sepia), invertColor);
                        let saturateColor = this.filter(this.saturateMatrix(saturate), sepiaColor);
                        let hueRotateColor = this.filter(this.hueRotateMatrix(hueRotate), saturateColor);

                        let colorObject = {
                            filters: { invert, sepia, saturate, hueRotate },
                            color: hueRotateColor
                        }

                        this.possibleColors.push(colorObject);
                    }
                }
            }
        }
        return this.possibleColors;
    },
    getFilters(targetColor, localTolerance) {
        this.possibleColors = this.possibleColors || this.generateColors();

        for (var i = 0; i < this.possibleColors.length; i++) {
            var color = this.possibleColors[i].color;
            if (
                Math.abs(color[0] - targetColor[0]) < localTolerance &&
                Math.abs(color[1] - targetColor[1]) < localTolerance &&
                Math.abs(color[2] - targetColor[2]) < localTolerance
            ) {
                this.filters = this.possibleColors[i].filters;
                return this.filters;
                break;
            }
        }
        localTolerance += this.tolerance;
        return this.getFilters(targetColor, localTolerance)
    },
    hexToRgb(color) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
            : { r: 1, g: 1, b: 1 };
    },
    getNewColor(color) {
        window.cssFilters = [];
        const filter = cssFilters.find(c => c.hex.toUpperCase() == color.toUpperCase());
        if(filter) { 
            this.style = filter.filter; 
            return;
        }
                
        let rgb = this.hexToRgb(color)
        let targetColor = [rgb.r,rgb.g,rgb.b];
        var filters = this.getFilters(targetColor, this.tolerance);
        var filtersCSS = 'filter: ' +
            'invert('+Math.floor(filters.invert*100)+'%) '+
            'sepia('+Math.floor(filters.sepia*100)+'%) ' +
            'saturate('+Math.floor(filters.saturate*100)+'%) ' +
            'hue-rotate('+Math.floor(filters.hueRotate)+'deg);';
        this.style = filtersCSS;

        var cssFilter = {hex: color, filter : filtersCSS};
        cssFilters.push(cssFilter);

        return this.style;
    },
}

export default filter;