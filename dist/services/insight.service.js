export class InsightService {
    insightRepo;
    constructor(insightRepo) {
        this.insightRepo = insightRepo;
    }
    getAll() {
        return this.insightRepo.getAll();
    }
    getRecent(limit = 10) {
        return this.insightRepo.getRecent(limit);
    }
    getByType(type) {
        return this.insightRepo.getByType(type);
    }
    getBySeverity(severity) {
        return this.insightRepo.getBySeverity(severity);
    }
    search(query, limit = 20) {
        return this.insightRepo.search(query, limit);
    }
    count() {
        return this.insightRepo.count();
    }
}
//# sourceMappingURL=insight.service.js.map