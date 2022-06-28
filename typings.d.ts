export interface PostTypes {
	_id: string;
	_createdAt: string;
	title: string;
	author: {
		name: string;
		image: string;
	};
	comments: CommentTypes[];
	description: string;
	mainImage: {
		asset: {
			url: string;
		};
	};
	slug: {
		current: string;
	};
	body: [object];
}

export interface CommentTypes {
	approved: boolean;
	comment: string;
	email: string;
	name: string;
	post: {
		_ref: string;
		_type: string;
	};
	_createAt: string;
	_id: string;
	_rev: string;
	_type: string;
	_updatedAt: string;
}
