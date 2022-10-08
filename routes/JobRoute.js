const router = require('express').Router()
const jobsController = require('../controllers/jobsController')
const auth = require('../middlewares/auth')

router.post('/create-jobs',auth,jobsController.createJob)

router.get('/get-Jobs',jobsController.getJobs)

router.post('/get-jobs-by-count',jobsController.getJobsByCount)

router.patch('/update-job-by-id',jobsController.updateJob)

router.get('/get-Job/:_id',jobsController.getJobById)

router.get('/get-Job-By-User',auth,jobsController.getJobByUserId)

router.delete('/delete-Job/:_id',jobsController.deleteJobById)

router.post('/job-response',auth,jobsController.responseJob)

router.post('/request-to-work',jobsController.requestToWork)

router.get('/job-response-by-id',auth,jobsController.responseJobById)

router.get("/job-search/:key",jobsController.jobSearch);

router.get('/get-jobs-by-count/:count',jobsController.getJobsByCount);

router.patch('/job-posted-by-user',auth,jobsController.jobPostedByUser);

router.get('/my-job-response',auth,jobsController.myJobResponse);

router.post('/get-my-job-response-by-job',jobsController.getJobResponseById)

router.patch('/update-response-status',jobsController.updateJobResponseStatus);

router.post("/job-search-filter",jobsController.searchFilters);

router.post("/service-provider-filter",jobsController.serviceProviderFilters);

router.post("/sp-with-sub-service",jobsController.subServiceProviderFilters);

module.exports = router