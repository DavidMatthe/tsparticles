import { Particle } from "../../../Particle";
import { Container } from "../../../Container";
import { Circle } from "../../../../Utils/QuadTree";

export class Infecter {
    public static infect(p1: Particle, container: Container): void {
        if (p1.infectionStage === undefined) {
            return;
        }

        const options = container.options;
        const infectionOptions = options.infection;

        if (!infectionOptions.enable || infectionOptions.stages.length < 1) {
            return;
        }

        const infectionStage1 = infectionOptions.stages[p1.infectionStage];
        const pxRatio = container.retina.pixelRatio;
        const radius = p1.size.value * 2 + infectionStage1.radius * pxRatio;
        const pos = {
            x: p1.position.x + p1.offset.x,
            y: p1.position.y + p1.offset.y,
        };

        const infectedStage1 = infectionStage1.infectedStage ?? p1.infectionStage;

        //const query = container.particles.spatialGrid.queryRadius(pos, radius)
        const query = container.particles.quadTree.query(new Circle(pos.x, pos.y, radius))
            .filter((t) => t.infectionStage === undefined || t.infectionStage !== p1.infectionStage);

        const infections = infectionStage1.rate;
        const neighbors = query.length;

        for (const p2 of query) {
            if (Math.random() < infections / neighbors) {
                if (p2.infectionStage === undefined) {
                    p2.startInfection(infectedStage1);
                } else if (p2.infectionStage < p1.infectionStage) {
                    p2.updateInfection(infectedStage1);
                } else if (p2.infectionStage > p1.infectionStage) {
                    const infectionStage2 = infectionOptions.stages[p2.infectionStage];
                    const infectedStage2 = infectionStage2?.infectedStage ?? p2.infectionStage;

                    p1.updateInfection(infectedStage2);
                }
            }
        }
    }
}