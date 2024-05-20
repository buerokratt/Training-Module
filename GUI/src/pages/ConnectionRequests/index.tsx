import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { Button, Card, DataTable, Icon } from "components";
import { Trigger } from "types/trigger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "hooks/useToast";
import { updateConnectionRequest } from "services/requests";
import withAuthorization, { ROLES } from "hoc/with-authorization";

const ConnectionRequests: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const { data: triggers, isLoading, isError, refetch } = useQuery<Trigger[]>({
    queryKey: ['services/connection-requests'],
  });

  const updateRequestStatus = useMutation({
    mutationFn: (data: { request: Trigger, status: 'approved' | 'declined' }) => 
      updateConnectionRequest(data.request, data.status),
    onSuccess: async (data) => {
      toast.open({
        type: "success",
        title: data.status === "approved" 
          ? t("connectionRequests.approvedConnection") 
          : t("connectionRequests.declinedConnection"),
        message: "",
      });

      await refetch();
    },
    onError: () => {
      toast.open({
        type: "error",
        title: t("connectionRequests.toast.failed.requests"),
        message: "",
      });
    }
  })

  useEffect(() => {
    if(isError) {
      toast.open({
        type: "error",
        title: t("connectionRequests.toast.failed.requests"),
        message: "",
      });
    }
  }, [isError]);

  const appRequestColumns = useMemo(
    () => getColumns(
      (trigger) => updateRequestStatus.mutate({ request: trigger, status: 'approved' }),
      (trigger) => updateRequestStatus.mutate({ request: trigger, status: 'declined' })),
    []
  );

  if (!triggers || isLoading) return <span>Loading ... </span>;

  return (
    <>
      <h1>{t("connectionRequests.title")}</h1>
      <Card>
        <DataTable 
          data={triggers} 
          columns={appRequestColumns} 
          sortable
        />
      </Card>
    </>
  );
};

const getColumns = (
  onApprove: (trigger: Trigger) => void,
  onDecline: (trigger: Trigger) => void,
) => {
  const appRequestColumnHelper = createColumnHelper<Trigger>();

  return [
    appRequestColumnHelper.accessor("intent", {
      header: "Intent",
      cell: (uniqueIdentifier) => uniqueIdentifier.getValue(),
    }),
    appRequestColumnHelper.accessor("serviceName", {
      header: "Service",
      cell: (uniqueIdentifier) => uniqueIdentifier.getValue(),
    }),
    appRequestColumnHelper.accessor("requestedAt", {
      header: "Requested At",
      cell: (props) => <span>{format(new Date(props.getValue()), "dd-MM-yyyy HH:mm:ss")}</span>,
    }),
    appRequestColumnHelper.display({
      header: "",
      cell: (props) => (
        <Button appearance='icon'>
          <Icon
            icon={
              <AiFillCheckCircle
                fontSize={22}
                color="rgba(34,139,34, 1)"
                onClick={() => onApprove(props.row.original)}
              />
            }
            size="medium"
          />
        </Button>
      ),
      id: "approve",
      meta: {
        size: "1%",
      },
    }),
    appRequestColumnHelper.display({
      header: "",
      cell: (props) => (
        <Button appearance='icon'>
          <Icon
            icon={
              <AiFillCloseCircle
                fontSize={22}
                color="rgba(210, 4, 45, 1)"
                onClick={() => onDecline(props.row.original)}
              />
            }
            size="medium"
          />
        </Button>
      ),
      id: "reject",
      meta: {
        size: "1%",
      },
    }),
    appRequestColumnHelper.display({
      header: "",
      id: "space",
      meta: {
        size: "1%",
      },
    }),
  ];
}

export default withAuthorization(ConnectionRequests, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
