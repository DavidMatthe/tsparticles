/**
 * [[include:pjsMigration.md]]
 *
 * @packageDocumentation
 */
import {
    type Container,
    type Engine,
    type ISourceOptions,
    type Particle,
    type RecursivePartial,
    type SingleOrMultiple,
    tsParticles,
} from "tsparticles-engine";
import type { IParticlesJS } from "./IParticlesJS";

declare global {
    interface Window {
        /**
         * @deprecated this method is obsolete, please use the new {@link Engine.load | tsParticles.load}
         * The particles.js compatibility object
         */
        Particles: typeof Particles;

        /**
         * @deprecated this method is obsolete, please use the new {@link Engine.dom | tsParticles.dom}
         * The particles.js compatibility dom array
         */
        pJSDom: Container[];

        /**
         * @deprecated this method is obsolete, please use the new {@link Engine.load | tsParticles.load}
         * The particles.js compatibility instance
         */
        particlesJS: IParticlesJS;
    }
}

/**
 * Initializes particles.js compatibility to the given engine
 *
 * @param engine - the engine that requires particles.js compatibility
 */
const initPjs = (
    engine: Engine
): {
    /**
     * @deprecated this method is obsolete, please use the new {@link Engine.load | tsParticles.load}
     * The particles.js compatibility object
     */
    Particles: typeof Particles;

    /**
     * @deprecated this method is obsolete, please use the new {@link Engine.dom | tsParticles.dom}
     * The particles.js compatibility dom array
     */
    pJSDom: Container[];

    /**
     * @deprecated this method is obsolete, please use the new {@link Engine.load | tsParticles.load}
     * The particles.js compatibility instance
     */
    particlesJS: IParticlesJS;
} => {
    /**
     * Loads the provided options to create a {@link Container} object.
     *
     * @deprecated this method is obsolete, please use the new tsParticles.load
     * @param tagId - the particles container element id
     * @param options - the options object to initialize the {@link Container}
     */
    const particlesJS = (tagId: string, options: ISourceOptions): Promise<Container | undefined> => {
        return engine.load(tagId, options);
    };

    /**
     * Loads the provided json with a GET request.
     * The content will be used to create a {@link Container} object.
     *
     * @deprecated this method is obsolete, please use the new tsParticles.loadJSON
     * @param tagId - the particles container element id
     * @param pathConfigJson - the json path to use in the GET request
     * @param callback - called after the {@link Container} is loaded and it will be passed as a parameter
     */
    particlesJS.load = (tagId: string, pathConfigJson: string, callback: (container?: Container) => void): void => {
        engine
            .loadJSON(tagId, pathConfigJson)
            .then((container) => {
                if (container) {
                    callback(container);
                }
            })
            .catch(() => {
                callback(undefined);
            });
    };

    /**
     * Adds a click handler to all the loaded {@link Container} objects.
     *
     * @deprecated this method is obsolete, please use the new tsParticles.setOnClickHandler
     * @param callback - the function called after the click event is fired
     */
    particlesJS.setOnClickHandler = (callback: (e: Event, particles?: Particle[]) => void): void => {
        engine.setOnClickHandler(callback);
    };

    /**
     * All the {@link Container} objects loaded
     *
     * @deprecated this method is obsolete, please use the new {@link Engine.dom | tsParticles.dom}
     */
    const pJSDom = engine.dom();

    window.particlesJS = particlesJS;
    window.pJSDom = pJSDom;
    window.Particles = Particles;

    return { particlesJS, pJSDom, Particles };
};

interface ResponsiveOptions {
    breakpoint: number;
    options: ParticlesOptions;
}

interface ParticlesOptions {
    color: SingleOrMultiple<string>;
    connectParticles: boolean;
    maxParticles: number;
    minDistance: number;
    responsive: ResponsiveOptions[];
    selector: string;
    sizeVariations: number;
    speed: number;
}

class Particles {
    private _container?: Container;

    static init(options: RecursivePartial<ParticlesOptions>): Particles {
        const particles = new Particles(),
            selector = options.selector;

        if (!selector) {
            throw new Error("No selector provided");
        }

        const el = document.querySelector(selector) as HTMLElement;

        if (!el) {
            throw new Error("No element found for selector");
        }

        tsParticles
            .set(selector.replace(".", "").replace("!", ""), el, {
                fullScreen: {
                    enable: false,
                },
                particles: {
                    color: {
                        value: options.color ?? "!000000",
                    },
                    links: {
                        color: "random",
                        distance: options.minDistance ?? 120,
                        enable: options.connectParticles ?? false,
                    },
                    move: {
                        enable: true,
                        speed: options.speed ?? 0.5,
                    },
                    number: {
                        value: options.maxParticles ?? 100,
                    },
                    size: {
                        value: { min: 1, max: options.sizeVariations ?? 3 },
                    },
                },
                responsive: options.responsive?.map((responsive) => ({
                    maxWidth: responsive.breakpoint,
                    options: {
                        particles: {
                            color: {
                                value: responsive.options?.color,
                            },
                            links: {
                                distance: responsive.options?.minDistance,
                                enable: responsive.options?.connectParticles,
                            },
                            number: {
                                value: options.maxParticles,
                            },
                            move: {
                                enable: true,
                                speed: responsive.options?.speed,
                            },
                            size: {
                                value: responsive.options?.sizeVariations,
                            },
                        },
                    },
                })),
            })
            .then((container) => {
                particles._container = container;
            });

        return particles;
    }

    destroy(): void {
        const container = this._container;

        container && container.destroy();
    }

    pauseAnimation(): void {
        const container = this._container;

        container && container.pause();
    }

    resumeAnimation(): void {
        const container = this._container;

        container && container.play();
    }
}

export { initPjs };
