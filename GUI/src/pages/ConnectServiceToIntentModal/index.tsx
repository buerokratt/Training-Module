import { FC, useEffect, useMemo, useState } from "react";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowForward } from "react-icons/md";
import { Button, DataTable, Dialog, FormInput, Icon, Modal, Track } from "components";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Service } from "types/service";
import { requestServiceIntentConnection } from "services/requests";
import { useToast } from "hooks/useToast";
import i18n from "../../../i18n";

type ConnectServiceToIntentModalProps = {
  onModalClose: () => void;
  intent: string;
};

const ConnectServiceToIntentModal: FC<ConnectServiceToIntentModalProps> = ({
  onModalClose, 
  intent,
}) => {

  const { t } = useTranslation();
  const toast = useToast();
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [selectedService, setSelectedService] = useState<Service>();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { data: services, isError } = useQuery<Service[]>({
    queryKey: ['services/unassigned'],
  });

  const connectRequest = useMutation({
    mutationFn: requestServiceIntentConnection,
    onSuccess: () => {
      onModalClose();
      toast.open({
        type: "success",
        title: t("connectionRequests.toast.requestedConnection"),
        message: "",
      });
    },
    onError: () => {
      toast.open({
        type: "error",
        title: t("connectionRequests.toast.failed.requestConnection"),
        message: "",
      });
    }
  })

  useEffect(() => {
    if(isError) {
      toast.open({
        type: "error",
        title: t("connectionRequests.toast.failed.availableServices"),
        message: "",
      })
    }
  }, [isError]);

  const serviceColumns = useMemo(
    () => getColumns((service) => {
      setSelectedService(service);
      setShowConfirmationModal(true);
    }), []);

  const handleConnect = () => {
    if (!selectedService) return;

    connectRequest.mutate({
      serviceId: selectedService.serviceId,
      serviceName: selectedService.name,
      intent
    })
  }

  return (
    <Dialog title={t("connectionRequests.connectIntentToService")} onClose={onModalClose} size="large">
      <Track
        direction="vertical"
        gap={8}
        style={{
          margin: "-16px -16px 0",
          padding: "16px",
          borderBottom: "1px solid #D2D3D8",
        }}
      >
        <FormInput
          label={t("connectionRequests.searchServices")}
          name="search"
          placeholder={t("connectionRequests.searchServices") + "..."}
          hideLabel
          onChange={(e) => setFilter(e.target.value)}
        />
      </Track>
      {!services && (
        <Track justify="center" gap={16} direction="vertical">
          <div className="loader" style={{ marginTop: 10 }} />
        </Track>
      )}
      {services && services.length === 0 && (
        <Track justify="center" gap={16} direction="vertical">
          <label style={{ margin: 30 }}>{t("connectionRequests.noServiceAvailable")}</label>
        </Track>
      )}
      {services && services.length > 0 && (
        <DataTable
          data={services}
          columns={serviceColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
          sortable
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
      {showConfirmationModal && (
        <Modal title={t("connectionRequests.connectionQuestion")} onClose={() => setShowConfirmationModal(false)}>
          <Track justify="end" gap={16}>
            <Button appearance="secondary" onClick={() => setShowConfirmationModal(false)}>
              {t("global.no")}
            </Button>
            <Button
              onClick={handleConnect}
            >
              {t("global.yes")}
            </Button>
          </Track>
        </Modal>
      )}
    </Dialog>
  );
};

const getColumns = (onClick: (service: Service) => void) => {
  const columnHelper = createColumnHelper<Service>();

  return [
    columnHelper.accessor("name", {
      header: i18n.t("connectionRequests.service") || "",
    }),
    columnHelper.display({
      id: "connect",
      cell: (props) => (
        <Button
          appearance="text"
          onClick={() => onClick(props.row.original)}
        >
          <Icon icon={<MdOutlineArrowForward color="rgba(0, 0, 0, 0.54)" />} />
          {i18n.t("connectionRequests.connect")}
        </Button>
      ),
      meta: {
        size: "1%",
      },
    }),
  ];
}

export default ConnectServiceToIntentModal;
