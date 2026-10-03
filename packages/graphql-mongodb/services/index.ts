import amqp from './amqp/index.ts';
import mongodb from './mongodb/index.ts';

// Реестр сервисов: динамический, поэтому значения — any.
type ServicesMap = Record<string, any>;

interface Service {
  name: string;
  init(this: ServicesMap): Promise<unknown>;
  endpoint?: unknown;
}

const Services: Service[] = [amqp, mongodb];

function run(this: ServicesMap, service: Service) {
  console.log(`sss init "${service.name}"`);

  return service.init
    .bind(this)()
    .then((result) => {
      console.log('\tok');
      service.endpoint = result;
      return result;
    });
}

function init(): Promise<ServicesMap> {
  const s: ServicesMap = {};

  return Services.reduce<Promise<unknown>>(
    (ok, service) =>
      ok.then(() =>
        run.call(s, service).then(() => {
          return (s[service.name] = service.endpoint);
        }),
      ),
    Promise.resolve(),
  ).then(() => {
    console.log('* Services started:', Object.keys(s));
    return s;
  });
}

const ok = init(); // promise-singleton

export default {
  Run(): Promise<ServicesMap> {
    return ok;
  },
};
