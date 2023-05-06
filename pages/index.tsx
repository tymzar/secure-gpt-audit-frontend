import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  LinearProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Error, Refresh, Title } from "@mui/icons-material";

import { fetchDatabase } from "../src/api/audit-controller/audit-controller";
import { AppUser, ChatQuery } from "../src/api/models";

let users: AppUser[];
let data: ChatQuery[];

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Home() {
  const [acOpen, setAcOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [rows, setRows] = React.useState<ChatQuery[]>([]);
  const [options, setOptions] = React.useState<readonly AppUser[]>([]);
  const [value, setValue] = React.useState<AppUser | null>();
  const loading = acOpen && options.length === 0;
  const [reload, setReload] = React.useState(true);

  const [details, setDetails] = React.useState();

  React.useEffect(() => {
    if (reload) {
      setRows([]);

      fetchDatabase().then((response) => {
        data = response
          .map((i) => ({
            ...i,
            timestamp: new Date(i.timestamp),
          }))
          .reverse();

        setRows([...data]);

        users = Object.values(
          data
            .map((i) => i.user)
            .reduce((acc: any, cur: AppUser) => {
              acc[cur.id] = cur;
              return acc;
            }, {})
        );

        setReload(false);
      });
    }
  }, [reload]);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(0); // For demo purposes.

      if (active) {
        setOptions([...users]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    value
      ? setRows(data.filter((row) => row.user.id === value?.id))
      : setRows(data ? [...data] : []);
  }, [value]);

  React.useEffect(() => {
    if (!acOpen) {
      setOptions([]);
    }
  }, [acOpen]);

  function openDetailsModal(option: any) {
    setDetails(option);
    handleOpen();
  }

  return (
    <>
      <Container sx={{}}>
        <h1>GPT inquiry audit log</h1>
        <Box
          sx={{
            display: "flex",
            gap: "32px",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: "100%" }}
            value={value}
            onChange={(_: unknown, newVal: AppUser | null) => {
              setValue(newVal);
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            open={acOpen}
            onOpen={() => {
              setAcOpen(true);
            }}
            onClose={() => {
              setAcOpen(false);
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for users"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Refresh
            sx={{ cursor: "pointer", margin: "auto" }}
            fontSize="large"
            onClick={() => {
              setReload(true);
            }}
          />
        </Box>
        <TableContainer component={Paper}>
          {rows?.length ? (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Inquiry</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.user.firstName} {row.user.lastName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        openDetailsModal(row);
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "none",
                        }}
                      >
                        <Tooltip title="Click to show original" sx={{}}>
                          <Typography>{row.sanitizedQueryContent}</Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {(row.timestamp as Date).getDay()}.
                      {(row.timestamp as Date).getMonth() + 1}.
                      {(row.timestamp as Date).getFullYear()}{" "}
                      {(row.timestamp as Date).getHours()}:
                      {(row.timestamp as Date).getMinutes()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
                marginY: 4,
              }}
            >
              {reload ? (
                <LinearProgress color="secondary" sx={{ width: "100%" }} />
              ) : (
                <>
                  <Error />
                  <Typography>No results found.</Typography>
                </>
              )}
            </Container>
          )}
        </TableContainer>
      </Container>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={modalOpen}
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        sx={{
          display: "flex",
          p: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: (theme) => theme.shadows[5],
            p: 4,
          }}
        >
          <Typography id="server-modal-title" variant="h6" component="h2">
            Original inquiry
          </Typography>
          <Typography
            id="server-modal-description"
            sx={{ pt: 2, maxWidth: "500px", overflow: "auto" }}
          >
            {(details as any)?.queryContent}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button
              color="secondary"
              variant="text"
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
