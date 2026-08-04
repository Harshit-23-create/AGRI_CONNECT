const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

// Mock axios to avoid hitting real APIs
jest.mock('axios');
const axios = require('axios');

describe('AgriConnect Backend API', () => {

  afterAll(async () => {
    // Disconnect mongoose if connected
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toContain('running');
    });
  });

  describe('POST /api/crop/recommend', () => {
    it('should fail if soil parameters are missing', async () => {
      const res = await request(app)
        .post('/api/crop/recommend')
        .send({ nitrogen: 10, phosphorus: 20 });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should successfully fallback or respond with a crop', async () => {
      // Mock ML response
      axios.post.mockResolvedValueOnce({
        data: {
          crop: 'Rice',
          confidence_score: 95.5,
          short_description: 'Rice is great'
        }
      });
      
      const payload = {
        nitrogen: 90, phosphorus: 42, potassium: 43,
        temperature: 20, humidity: 80, ph: 6.5, rainfall: 200
      };

      const res = await request(app)
        .post('/api/crop/recommend')
        .send(payload);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('crop', 'Rice');
    });
  });
});
