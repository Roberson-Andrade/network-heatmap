import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "./components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { Room } from "./types";
import { v4 } from "uuid";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Legend,
  Bar,
} from "recharts";

const FIELDS_LABEL: Record<keyof Room, string> = {
  id: "ID",
  room: "Cômodo",
  signalLevel24: "Nível de sinal (dbm) 2,4GHz",
  signalLevel5: "Nível de sinal (dbm) 5GHz",
  speed24: "Velocidade (Mbps) 2,4GHz",
  speed5: "Velocidade (Mbps) 5GHz",
  interference: "Interferência",
};

const NOT_REQUIRED_FIELDS = new Set<keyof Room>([
  "interference",
  "signalLevel5",
  "speed5",
]);

export function Rooms() {
  const { toast } = useToast();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room>();
  const [open, setOpen] = useState(false);

  function onChangeOpen(value: boolean) {
    if (!value) {
      setEditingRoom(undefined);
    }

    setOpen(value);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const roomId = editingRoom?.id;

    const formData = new FormData(event.target as HTMLFormElement);

    const missingFields: string[] = [];

    for (const [field, value] of formData.entries()) {
      if (!value && !NOT_REQUIRED_FIELDS.has(field as keyof Room)) {
        missingFields.push(FIELDS_LABEL[field as keyof typeof FIELDS_LABEL]);
      }
    }

    if (missingFields.length > 0) {
      toast({
        title: "Preencha todos os campos",
        description: `Campos faltando: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    const newRoom = {
      ...Object.fromEntries(formData.entries()),
      id: roomId ?? v4(),
    } as unknown as Room;

    if (roomId) {
      const index = rooms.findIndex((room) => room.id === roomId);
      if (index !== -1) {
        rooms[index] = newRoom;
      }

      setRooms([...rooms]);
    } else {
      setRooms([...rooms, newRoom]);
    }

    onChangeOpen(false);
  }

  function removeRoom(id: string) {
    setRooms(rooms.filter((room) => room.id !== id));
  }

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "room",
      header: "Cômodo",
    },
    {
      accessorKey: "signalLevel24",
      header: "Nível de sinal (dbm) 2,4GHz",
    },
    {
      accessorKey: "signalLevel5",
      header: "Nível de sinal (dbm) 5GHz",
    },
    {
      accessorKey: "speed24",
      header: "Velocidade (Mbps) 2,4GHz",
    },
    {
      accessorKey: "speed5",
      header: "Velocidade (Mbps) 5GHz",
    },
    {
      accessorKey: "interference",
      header: "Interferência",
      size: 20,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex w-full">
                <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                  <span className="sr-only">Abrir menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingRoom(row.original);
                  setOpen(true);
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => removeRoom(row.original.id)}>
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <section className="w-full justify-center px-4 flex flex-col gap-2">
        <div className="flex">
          <ResponsiveContainer height={400} width="50%">
            <BarChart
              stackOffset="sign"
              data={rooms.map((room) => ({
                name: room.room,
                signalLevel24: room.signalLevel24,
                signalLevel5: room.signalLevel5,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" domain={[-90, 0]} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="signalLevel24"
                name={FIELDS_LABEL.signalLevel24}
                fill="#8884d8"
              />
              <Bar
                dataKey="signalLevel5"
                name={FIELDS_LABEL.signalLevel5}
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer height={400} width="50%">
            <BarChart
              data={rooms.map((room) => ({
                name: room.room,
                speed24: room.speed24,
                speed5: room.speed5,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="speed24"
                name={FIELDS_LABEL.speed24}
                fill="#8884d8"
              />
              <Bar dataKey="speed5" name={FIELDS_LABEL.speed5} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex justify-end items-center max-w-5xl">
            <Dialog open={open} onOpenChange={onChangeOpen}>
              <DialogTrigger asChild>
                <Button>Adicionar cômodo</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <form id="room-form" onSubmit={onSubmit}>
                    <DialogTitle>Adicionar cômodo</DialogTitle>
                    <DialogDescription>
                      Adicione as informações dos sinais de rede para um
                      determinado cômodo
                    </DialogDescription>

                    <div className="grid grid-cols-12 py-4 gap-4">
                      <div className="flex flex-col gap-1 col-span-12">
                        <Label htmlFor="room">Cômodo</Label>
                        <Input
                          id="room"
                          name="room"
                          placeholder="Ex: sala de estar"
                          defaultValue={editingRoom?.room}
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-6">
                        <Label htmlFor="room">Nível de sinal (dbm)</Label>
                        <div className="flex gap-2">
                          <Input
                            name="signalLevel24"
                            id="signalLevel24"
                            placeholder="2,4GHz"
                            type="number"
                            defaultValue={editingRoom?.signalLevel24}
                          />
                          <Input
                            name="signalLevel5"
                            id="signalLevel5"
                            placeholder="5GHz"
                            type="number"
                            defaultValue={editingRoom?.signalLevel5}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 col-span-6">
                        <Label htmlFor="room">Velocidade (Mbps)</Label>
                        <div className="flex gap-2">
                          <Input
                            name="speed24"
                            id="speed24"
                            placeholder="2,4GHz"
                            type="number"
                            defaultValue={editingRoom?.speed24}
                          />
                          <Input
                            name="speed5"
                            id="speed5"
                            placeholder="5GHz"
                            type="number"
                            defaultValue={editingRoom?.speed5}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 col-span-12">
                        <Label htmlFor="interference">Interferência</Label>
                        <Input
                          name="interference"
                          id="interference"
                          defaultValue={editingRoom?.interference}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>

                      <Button type="submit">Salvar</Button>
                    </DialogFooter>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md  max-w-5xl w-full">
            <DataTable
              columns={columns}
              data={rooms}
              options={{
                getRowId: (row) => row.id,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
