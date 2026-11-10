import Doctor from "../doctor/doctor.model.js";
import Patient from "../patient/patient.model.js";

const getOverview = async () => {
  const [totalDoctors, totalPatients] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  return {
    totalDoctors,
    totalPatients,
  };
};

const getPatientsPerDoctor = async () => {
  const result = await Doctor.aggregate([
    {
      $lookup: {
        from: "patients",
        let: { doctorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$doctorId", "$$doctorId"],
              },
            },
          },
          {
            $count: "total",
          },
        ],
        as: "patientCount",
      },
    },
    {
      $project: {
        _id: 0,
        doctorId: "$_id",
        doctorName: "$name",
        specialization: 1,
        totalPatients: {
          $ifNull: [{ $arrayElemAt: ["$patientCount.total", 0] }, 0],
        },
      },
    },
    {
      $sort: {
        totalPatients: -1,
      },
    },
  ]);

  return result;
};

const getDoctorPatientDistribution = async () => {
  const result = await Doctor.aggregate([
    {
      $lookup: {
        from: "patients",
        let: { doctorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$doctorId", "$$doctorId"],
              },
            },
          },
          {
            $count: "total",
          },
        ],
        as: "patientCount",
      },
    },
    {
      $project: {
        _id: 0,
        name: "$name",
        value: {
          $ifNull: [{ $arrayElemAt: ["$patientCount.total", 0] }, 0],
        },
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
  ]);

  return result;
};

const getPatientStatistics = async (query: {
  startDate?: string;
  endDate?: string;
  period?: "daily" | "monthly" | "yearly";
}) => {
  const matchStage: Record<string, any> = {};

  // Date Filter
  if (query.startDate || query.endDate) {
    const createdAt: Record<string, Date> = {};

    if (query.startDate) {
      createdAt.$gte = new Date(`${query.startDate}T00:00:00.000Z`);
    }

    if (query.endDate) {
      createdAt.$lte = new Date(`${query.endDate}T23:59:59.999Z`);
    }

    matchStage.createdAt = createdAt;
  }

  // Grouping Format
  let dateFormat = "%Y-%m-%d";

  if (query.period === "monthly") {
    dateFormat = "%Y-%m";
  } else if (query.period === "yearly") {
    dateFormat = "%Y";
  }

  const result = await Patient.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        totalPatients: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalPatients: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return result;
};

const getDoctorStatistics = async (query: {
  startDate?: string;
  endDate?: string;
  period?: "daily" | "monthly" | "yearly";
}) => {
  const matchStage: Record<string, any> = {};

  // Date Filter
  if (query.startDate || query.endDate) {
    const createdAt: Record<string, Date> = {};

    if (query.startDate) {
      createdAt.$gte = new Date(`${query.startDate}T00:00:00.000Z`);
    }

    if (query.endDate) {
      createdAt.$lte = new Date(`${query.endDate}T23:59:59.999Z`);
    }

    matchStage.createdAt = createdAt;
  }

  // Grouping Format
  let dateFormat = "%Y-%m-%d";

  if (query.period === "monthly") {
    dateFormat = "%Y-%m";
  } else if (query.period === "yearly") {
    dateFormat = "%Y";
  }

  const result = await Doctor.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        totalDoctors: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalDoctors: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return result;
};

export const DashboardService = {
  getOverview,
  getPatientsPerDoctor,
  getDoctorPatientDistribution,
  getPatientStatistics,
  getDoctorStatistics,
};
