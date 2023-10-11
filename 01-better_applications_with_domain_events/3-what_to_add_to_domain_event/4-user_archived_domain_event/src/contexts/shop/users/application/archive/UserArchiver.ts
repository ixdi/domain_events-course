import { EventBus } from "../../../../shared/domain/EventBus";
import { UserFinder } from "../../domain/UserFinder";
import { UserRepository } from "../../domain/UserRepository";
import { UserStatus } from "../../domain/UserStatus";

export class UserArchiver {
	private readonly finder: UserFinder;

	constructor(
		private readonly repository: UserRepository,
		private readonly eventBus: EventBus,
	) {
		this.finder = new UserFinder(repository);
	}

	async archive(id: string): Promise<void> {
		const user = await this.finder.find(id);

		user.updateStatus(UserStatus.Archived);

		await this.repository.save(user);
		await this.eventBus.publish(user.pullDomainEvents());
	}
}
