import { createSecureContext } from 'tls';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Blocks = require('Blocks');
const Animation = require('Animation');
const Time = require('Time');
export const Diagnostics = require('Diagnostics');

(async function () {
  const [parent, dummy] = await Promise.all([
    Scene.root.findFirst('roundsParent'),
    Scene.root.findFirst('needlerRound'),
  ]);

  let rounds = [];

  const timeDriverParameters = {
    durationMilliseconds: 400,
    loopCount: 1,
    mirror: false,
  };

  TouchGestures.onTap().subscribe(() => {
    let block = Blocks.instantiate('block0', { name: 'round' }).then(
      (block) => {
        parent.addChild(block);

        const timeDriver = Animation.timeDriver(timeDriverParameters);
        const sampler = Animation.samplers.linear(0, 1);
        const translationAnimation = Animation.animate(timeDriver, sampler);

        const randomAngle = Math.random() - 0.5;

        const randomSamplerX = Animation.samplers.linear(0, randomAngle / 10);
        const randomTranslationAnimation = Animation.animate(
          timeDriver,
          randomSamplerX
        );

        block.transform.y = translationAnimation;
        block.transform.x = randomTranslationAnimation;
        block.transform.rotationZ = -(randomAngle / 6);
        timeDriver.start();

        rounds.push(block);
        Time.setTimeout(destroyRound, 400);
      }
    );
  });

  const destroyRound = () => {
    Scene.destroy(rounds.shift());
  };
})();
