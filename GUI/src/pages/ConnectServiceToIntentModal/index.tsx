import { FC, useEffect, useMemo, useState } from "react";
import { createColumnHelper, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowForward } from "react-icons/md";
import { Button, DataTable, Dialog, FormInput, Icon, Modal, Track } from "components";
import { useMutation } from "@tanstack/react-query";
import { Service } from "types/service";
import { requestServiceIntentConnection } from "services/requests";
import { useToast } from "hooks/useToast";
import { useDebounce } from "use-debounce";
import i18n from "../../../i18n";
import { rasaApi } from "services/api";

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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [selectedService, setSelectedService] = useState<Service>();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [services, setServices] = useState<Service[] | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 500);

  const getServices = (pagination: PaginationState, sorting: SortingState, search: string | null) => {
    let sort = 'name asc';
    if(sorting.length > 0)
      sort = sorting[0].id + ' ' + (sorting[0].desc ? 'desc' : 'asc');
    
    rasaApi
      .post(`services/unassigned`, {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        sorting: sort,
        search,
      })
      .then((res: any) => {
        setServices(res?.data?.response ?? []);
        setTotalPages(res?.data?.response[0]?.totalPages ?? 1);
      })
      .catch((error: any) => {
        toast.open({
          type: "error",
          title: t("connectionRequests.toast.failed.availableServices"),
          message: "",
        });
        console.error(error);
      });
  };

  useEffect(() => {
    getServices(pagination, sorting, debouncedSearch);
  }, [pagination, sorting, debouncedSearch]);

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
          onChange={(e) => setSearch(e.target.value)}
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
          sortable
          pagination={pagination}
          setPagination={setPagination}
          pageSizeOptions={[6, 8, 10, 16, 20]}
          sorting={sorting}
          setSorting={(state: SortingState) => {
            setSorting(state);
            getServices(pagination, state, search);
          }}
          pagesCount={totalPages}
          isClientSide={false}
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
