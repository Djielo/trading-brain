import { strengthen, weaken } from './hebbian.js';
import { decaySynapse } from './decay.js';
import { getLogger } from '../utils/logger.js';
export class SynapseManager {
    repo;
    cal;
    cache = new Map();
    logger = getLogger();
    constructor(repo, cal) {
        this.repo = repo;
        this.cal = cal;
        this.loadCache();
    }
    loadCache() {
        const all = this.repo.getAll();
        for (const syn of all) {
            this.cache.set(syn.id, syn);
        }
        this.logger.info(`Synapse cache loaded: ${this.cache.size} synapses`);
    }
    updateCalibration(cal) {
        this.cal = cal;
    }
    getOrCreate(fingerprint) {
        const id = `syn_${fingerprint}`;
        let synapse = this.cache.get(id);
        if (!synapse) {
            synapse = {
                id,
                fingerprint,
                weight: 0.5,
                wins: 0,
                losses: 0,
                activations: 0,
                total_profit: 0,
                last_activated: new Date().toISOString(),
            };
            this.cache.set(id, synapse);
        }
        return synapse;
    }
    get(id) {
        return this.cache.get(id);
    }
    getByFingerprint(fingerprint) {
        return this.cache.get(`syn_${fingerprint}`);
    }
    recordWin(fingerprint, profitPct) {
        const synapse = this.getOrCreate(fingerprint);
        synapse.total_profit += profitPct;
        strengthen(synapse, this.cal.learningRate);
        this.repo.upsert(synapse);
        return synapse;
    }
    recordLoss(fingerprint, profitPct) {
        const synapse = this.getOrCreate(fingerprint);
        synapse.total_profit += profitPct;
        weaken(synapse, this.cal.weakenPenalty);
        this.repo.upsert(synapse);
        return synapse;
    }
    runDecay() {
        const halfLifeMs = this.cal.decayHalfLifeDays * 86400000;
        let decayed = 0;
        for (const synapse of this.cache.values()) {
            if (decaySynapse(synapse, halfLifeMs)) {
                this.repo.upsert(synapse);
                decayed++;
            }
        }
        if (decayed > 0) {
            this.logger.info(`Decayed ${decayed} synapses`);
        }
        return decayed;
    }
    getAll() {
        return Array.from(this.cache.values());
    }
    count() {
        return this.cache.size;
    }
    getStrongest(limit = 20) {
        return Array.from(this.cache.values())
            .sort((a, b) => b.weight - a.weight)
            .slice(0, limit);
    }
    getAvgWeight() {
        if (this.cache.size === 0)
            return 0;
        let sum = 0;
        for (const syn of this.cache.values())
            sum += syn.weight;
        return sum / this.cache.size;
    }
    clear() {
        this.cache.clear();
    }
}
//# sourceMappingURL=synapse-manager.js.map