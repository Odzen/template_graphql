import type { PrismaClient, Service, Prisma, User } from '@prisma/client'

export type ResolverContext = { orm: PrismaClient; user: User | undefined }

export const resolver: Record<keyof Service, (parent: Service) => unknown> = {
	id: (parent) => parent.id,
	createdAt: (parent) => parent.createdAt,
	updatedAt: (parent) => parent.updatedAt,
	name: (parent) => parent.name,
	price: (parent) => parent.price,
}

export async function findAll(
	_parent: unknown,
	args: { where?: Prisma.ServiceWhereInput; skip?: number; take?: number },
	context: ResolverContext
): Promise<Service[] | null> {
	try {
		return context.orm.service.findMany({
			where: args.where,
			skip: args.skip,
			take: args.take,
		})
	} catch (e) {
		console.log('Error: ', e)
		return null
	}
}

export async function findOne(
	_parent: unknown,
	args: { id: string },
	context: ResolverContext
): Promise<Service | null> {
	try {
		const service = context.orm.service.findUnique({
			where: {
				id: args.id,
			},
		})
		return service
	} catch (e) {
		console.log('Error: ', e)
		return null
	}
}

export async function createService(
	_parent: unknown,
	{
		data,
	}: {
		data: Pick<Service, 'name' | 'price'>
	},
	{ orm }: ResolverContext
): Promise<Service | null> {
	const { name, price } = data

	try {
		const avo = await orm.service.create({
			data: {
				name,
				price,
			},
		})

		return avo
	} catch (e) {
		console.log('Error creating Service: ', e)
		return null
	}
}
