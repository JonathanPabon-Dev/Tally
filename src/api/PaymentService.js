import { supabase, validateConnection } from "../supabase/supabaseClient";

const PaymentService = {
  getPayments: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      if (!validateConnection) {
        throw new Error("Connection error!");
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // First, get the total count for pagination
      const countQuery = supabase
        .from("bills")
        .select("*", { count: "exact", head: true });

      // Apply filters to count query
      if (filters.billName !== undefined && filters.billName !== "") {
        countQuery.eq("billName", filters.billName);
      }
      if (filters.deadlineSince !== undefined && filters.deadlineSince !== "") {
        countQuery.gte("paymentDeadline", filters.deadlineSince);
      }
      if (filters.deadlineUntil !== undefined && filters.deadlineUntil !== "") {
        countQuery.lte("paymentDeadline", filters.deadlineUntil);
      }

      const { count } = await countQuery;

      // Then get the paginated data
      let query = supabase
        .from("bills")
        .select()
        .order("paymentDeadline", { ascending: false })
        .range(from, to);

      // Apply filters to main query
      if (filters.billName !== undefined && filters.billName !== "") {
        query = query.eq("billName", filters.billName);
      }
      if (filters.deadlineSince !== undefined && filters.deadlineSince !== "") {
        query = query.gte("paymentDeadline", filters.deadlineSince);
      }
      if (filters.deadlineUntil !== undefined && filters.deadlineUntil !== "") {
        query = query.lte("paymentDeadline", filters.deadlineUntil);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data,
        page,
        pageSize,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  },

  createPayment: async (payment) => {
    try {
      if (!validateConnection) {
        throw new Error("Connection error!");
      }
      const response = await supabase.from("bills").insert({ ...payment });
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  updatePayment: async (payment) => {
    try {
      if (!validateConnection) {
        throw new Error("Connection error!");
      }
      const response = await supabase
        .from("bills")
        .update({ ...payment })
        .eq("id", payment.id);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  deletePayment: async (paymentId) => {
    try {
      if (!validateConnection) {
        throw new Error("Connection error!");
      }
      const response = await supabase
        .from("bills")
        .delete()
        .eq("id", paymentId);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default PaymentService;
