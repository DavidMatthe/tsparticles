import type { Engine } from "tsparticles-engine";
import { PolygonPathGenerator } from "./PolygonPathGenerator";

export const polygonPathName = "polygonPathGenerator";

/**
 *
 * @param engine
 */
export function loadPolygonPath(engine: Engine): void {
    engine.addPathGenerator(polygonPathName, new PolygonPathGenerator());
}
