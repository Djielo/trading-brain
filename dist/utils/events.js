import { TypedEventBus as GenericEventBus } from '@timmeck/brain-core';
export class TypedEventBus extends GenericEventBus {
}
let busInstance = null;
export function getEventBus() {
    if (!busInstance) {
        busInstance = new TypedEventBus();
    }
    return busInstance;
}
//# sourceMappingURL=events.js.map