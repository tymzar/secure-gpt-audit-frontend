import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import {
  Button,
  CircularProgress,
  Icon,
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
import { Error, Title } from "@mui/icons-material";
import { UUID, randomUUID } from "crypto";

const employees = [
  {
    id: "af5bf4ae-1aee-4a66-afdc-1c2ed41478ed",
    firstName: "First 1",
    lastName: "Last",
  },
  {
    id: "ee575a71-0325-43f6-bc1b-4ab08d87fa99",
    firstName: "First 2",
    lastName: "Last",
  },
  {
    id: "08685188-a052-4a54-b742-dca07f271fc3",
    firstName: "First 3",
    lastName: "Last",
  },
  {
    id: "d90bed01-23d5-441b-bfd4-62c88f997f72",
    firstName: "First 4",
    lastName: "Last",
  },
  {
    id: "3539aaee-1f2f-43ba-b784-477f750e7e8d",
    firstName: "First 5",
    lastName: "Last",
  },
  {
    id: "725f43d8-2772-4d7a-b02e-20c5e455bd4c",
    firstName: "First 6",
    lastName: "Last",
  },
];

function createData(
  id: string,
  employee: { id: string; firstName: string; lastName: string },
  date: Date,
  inquiry: { sanitized: string; original: string }
) {
  return { id, employee, date, inquiry };
}

const data = [
  createData(
    "614b8c1e-5d15-49ad-8237-eb5a0e19f629",
    employees[0],
    new Date("06-05-2023"),
    {
      sanitized: "sanitized",
      original: "some nice detailed query used with credentials",
    }
  ),
  createData(
    "bb979cf1-3b35-41ef-b030-0f2fa8493adc",
    employees[0],
    new Date("06-05-2023"),
    {
      sanitized: "sanitized",
      original: "org",
    }
  ),
  createData(
    "2b09281f-0791-4330-99b7-d51bd3b243a7",
    employees[1],
    new Date("06-05-2023"),
    {
      sanitized: "sanitized",
      original: "org",
    }
  ),
  createData(
    "0c6c8a8b-294c-40c1-a15c-f68f45f4e036",
    employees[4],
    new Date("06-05-2023"),
    {
      sanitized: "sanitized",
      original: "org",
    }
  ),
  createData(
    "ba01fa3b-8246-411b-8604-3886e9c64ef6",
    employees[4],
    new Date("06-05-2023"),
    {
      sanitized: "sanitized",
      original: "org",
    }
  ),
];

let rows = [...data];

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
  const [options, setOptions] = React.useState<readonly any[]>([]);
  const [value, setValue] = React.useState<any>();
  const loading = acOpen && options.length === 0;

  const [details, setDetails] = React.useState();

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(0); // For demo purposes.

      if (active) {
        setOptions([...employees]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (value) {
      rows = data.filter((row) => row.employee.id === value?.id);
    } else {
      rows = [...data];
    }
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
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          sx={{ width: "100%", marginBottom: 2 }}
          value={value}
          onChange={(_: unknown, newVal: string) => {
            setValue(newVal);
          }}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
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
              label="Search for employees"
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
        <TableContainer component={Paper}>
          {rows.length ? (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
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
                      {row.employee.firstName} {row.employee.lastName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        openDetailsModal(row);
                      }}
                    >
                      <Tooltip title="Click to show original">
                        <Typography>{row.inquiry.sanitized}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">{row.date.toString()}</TableCell>
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
              <Typography>No results found.</Typography>
              <Error />
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
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: (theme) => theme.shadows[5],
            p: 4,
          }}
        >
          <Typography id="server-modal-title" variant="h6" component="h2">
            Original inquiry
          </Typography>
          <Typography id="server-modal-description" sx={{ pt: 2 }}>
            {(details as any)?.inquiry.original}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
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
