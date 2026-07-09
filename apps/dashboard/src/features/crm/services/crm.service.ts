import type { ApiSuccessEnvelope, Customer, MembershipTier, PointHistory } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export interface CustomerPayload {
  name: string;
  phone?: string | null;
  email?: string | null;
  membershipTierId?: string | null;
}

export async function fetchCustomers() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Customer[]>>("/api/crm/customers");
  return data.data;
}

export async function createCustomer(payload: CustomerPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Customer>>("/api/crm/customers", payload);
  return data.data;
}

export async function updateCustomer(id: string, payload: Partial<CustomerPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Customer>>(`/api/crm/customers/${id}`, payload);
  return data.data;
}

export async function deleteCustomer(id: string) {
  await apiClient.delete(`/api/crm/customers/${id}`);
}

export async function fetchCustomerPoints(id: string) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<PointHistory[]>>(`/api/crm/customers/${id}/points`);
  return data.data;
}

export interface MembershipTierPayload {
  name: string;
  minPoint: number;
  discountPercent: string;
}

export async function fetchMembershipTiers() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<MembershipTier[]>>("/api/crm/membership-tiers");
  return data.data;
}

export async function createMembershipTier(payload: MembershipTierPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<MembershipTier>>("/api/crm/membership-tiers", payload);
  return data.data;
}

export async function updateMembershipTier(id: string, payload: Partial<MembershipTierPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<MembershipTier>>(
    `/api/crm/membership-tiers/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteMembershipTier(id: string) {
  await apiClient.delete(`/api/crm/membership-tiers/${id}`);
}
