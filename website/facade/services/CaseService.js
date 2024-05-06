import APIProvider from "../utilities/APIProvider.js";

const CaseService = (async () => {
  const apiProvider = await APIProvider();

  return {
    index: async (cookies) => {
      try {
        const cases = await apiProvider.get("/cases", {
          headers: {
            Cookie: cookies,
          },
        });

        return cases.data?.cases || [];
      } catch (error) {
        throw error;
      }
    },

    show: async (id, cookies) => {
      try {
        const noiCase = await apiProvider.get(`/cases/${id}`, {
          headers: {
            Cookie: cookies,
          },
        });

        return noiCase.data?.noiCase || {}; // Changed from noiCases to noiCase
      } catch (error) {
        throw error;
      }
    },

    create: async (noiCases, cookies) => {
      try {
        await apiProvider.post("/cases", noiCases, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },

    update: async (id, noiCases, cookies) => {
      try {
        await apiProvider.put(`/cases/${id}`, noiCases, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },

    destroy: async (id, cookies) => {
      try {
        await apiProvider.delete(`/cases/${id}`, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };
})();

export default CaseService;
