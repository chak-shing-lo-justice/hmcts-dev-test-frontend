import axios from 'axios';
import { Application } from 'express';

export const TEST_EXAMPLE_ROUTE = '/example';

export default function (app: Application): void {
  app.get(TEST_EXAMPLE_ROUTE, async (req, res) => {
    try {
      // An example of connecting to the backend (a starting point)
      const response = await axios.get('http://localhost:4000/testing/get-example-case');
      console.log(response.data);
      res.render('example', { 'example': response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('example', {});
    }
  });
}
