import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body)
  const { connections, services } = req.body;
  const usedServiceIds = new Set(connections.map(x => x.service));
  const unusedServices = services.filter(x => !usedServiceIds.has(x.serviceId));

  console.log(unusedServices)
  
  return res.status(200).send({ 
    unusedServices
  });
});

export default router;
