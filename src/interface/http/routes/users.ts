import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { db } from '../../../infrastructure/db/index.js';

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Public endpoint to get user count (for testing)
  fastify.get('/count', async (request, reply) => {
    try {
      const result = await db
        .selectFrom('users')
        .select(db.fn.count('id').as('count'))
        .executeTakeFirst();

      const count = result ? Number(result.count) : 0;
      
      return { 
        count,
        message: `There are ${count} users in the database.`
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ 
        error: 'Error retrieving user count',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // The following endpoints require authentication
  // We will use the authentication decorator once implemented
  
  // Get list of users
  fastify.get('/', async (request, reply) => {
    try {
      const users = await db
        .selectFrom('users')
        .select(['id', 'email', 'name', 'created_at', 'updated_at'])
        .execute();

      return { 
        users,
        count: users.length
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Error retrieving users' });
    }
  });

  // Get specific user by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = parseInt(id, 10);

      const user = await db
        .selectFrom('users')
        .select(['id', 'email', 'name', 'created_at', 'updated_at'])
        .where('id', '=', userId)
        .executeTakeFirst();

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return { user };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Error retrieving user' });
    }
  });

  // Update user
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const userId = parseInt(id, 10);
      const { name } = request.body as { name?: string };

      // Later we'll add verification that user is updating their own profile
      // if (request.user.id !== userId) { ... }

      const updatedUser = await db
        .updateTable('users')
        .set({
          name: name ?? null,
          updated_at: new Date(),
        })
        .where('id', '=', userId)
        .returning(['id', 'email', 'name', 'created_at', 'updated_at'])
        .executeTakeFirst();

      if (!updatedUser) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return { user: updatedUser };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Error updating user' });
    }
  });
};

export default userRoutes;