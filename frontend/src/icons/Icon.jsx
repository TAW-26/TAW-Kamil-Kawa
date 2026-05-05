import IconLogo from './IconLogo';
import IconBall from './IconBall';
import IconRacket from './IconRacket';
import IconCourt from './IconCourt';
import IconPool from './IconPool';
import IconWeights from './IconWeights';
import IconStadium from './IconStadium';
import IconLock from './IconLock';
import IconCheck from './IconCheck';
import IconAlert from './IconAlert';
import IconBack from './IconBack';
import IconClock from './IconClock';
import IconPin from './IconPin';
import IconCoin from './IconCoin';
import IconTag from './IconTag';
import IconBook from './IconBook';
import IconArrow from './IconArrow';

const REGISTRY = {
  logo: IconLogo,
  ball: IconBall,
  racket: IconRacket,
  court: IconCourt,
  pool: IconPool,
  weights: IconWeights,
  stadium: IconStadium,
  lock: IconLock,
  check: IconCheck,
  alert: IconAlert,
  back: IconBack,
  clock: IconClock,
  pin: IconPin,
  coin: IconCoin,
  tag: IconTag,
  book: IconBook,
  arrow: IconArrow,
};

export default function Icon({ name, size = 20, className = '', ...rest }) {
  const Component = REGISTRY[name] || IconStadium;
  return <Component size={size} className={className} {...rest} />;
}
