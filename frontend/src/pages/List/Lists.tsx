import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import api from "@/globals";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuth from "@/useAuth";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import MovieType from "../../types/MovieType";
import TVType from "../../types/TVType";
import ListTitle from "./ListTitle";
import MovieBox from "./MovieBox";
import ShowBox from "./ShowBox";
type Props = {};

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

interface List {
  createdAt: Date;
  items: (MovieType | TVType)[];
  listId: any;
  name: string;
  userIds: string[];
  users: User[];
}

function List({}: Props) {
  const isMobile = useIsMobile();
  const [newListName, setNewListName] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    getLists();

    const intervalId = setInterval(() => {
      getLists();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getOpenStates(lists: List[]) {
    const storedOpenStates: Record<number, boolean> = {};

    lists.forEach((list, index) => {
      const storedState = localStorage.getItem(`list_${list.listId}_open`);
      if (storedState !== null) {
        storedOpenStates[index] = JSON.parse(storedState);
      }
    });

    return storedOpenStates;
  }

  async function getLists() {
    await axios
      .get(`${api}/lists/`, {
        withCredentials: true,
      })
      .then((res) => {
        setLists(res.data);
        setOpenStates(getOpenStates(res.data));
      });
  }

  const toggleList = (index: number, listId: string) => {
    const newState = !openStates[index];

    setOpenStates((prev) => ({
      ...prev,
      [index]: newState,
    }));

    localStorage.setItem(`list_${listId}_open`, JSON.stringify(newState));
  };

  const handleSubmit = async () => {
    try {
      if (!newListName) {
        console.error("List name is required");
        toast.error("List name is required");
        return;
      }

      await axios.post(
        `${api}/lists/create`,
        { listName: newListName },
        { withCredentials: true }
      );

      setListOpen(false);
      setNewListName("");
      await getLists();
      toast.success("List created successfully!");
    } catch (error) {
      console.error("Error creating list:", error);
      return null;
    }
  };

  const handleRemoveItem = async (
    listId: string,
    itemId: number,
    itemType: string
  ) => {
    const prevList = lists;

    const keyName = (itemId + itemType).toString();
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.listId === listId) {
          const newItems = { ...list.items };
          delete newItems[keyName as keyof typeof newItems];

          return {
            ...list,
            items: newItems,
          };
        }
        return list;
      })
    );
    try {
      await axios.post(
        `${api}/lists/removeItem`,
        { listId, itemId, itemType },
        { withCredentials: true }
      );
      toast.success("Item removed from list");
    } catch (error) {
      setLists(prevList);
      toast.error("Error removing item from list");
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 gap-4 mx-auto">
      <Input placeholder="Search for a list"></Input>
      {isMobile ? (
        <Drawer open={listOpen} onOpenChange={setListOpen}>
          <DrawerTrigger asChild>
            <Button>Create a List</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create a List</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <Input
                placeholder="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-11/12 mx-auto"
              />
            </DrawerDescription>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSubmit}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={listOpen} onOpenChange={setListOpen}>
          <DialogTrigger asChild>
            <Button>Create a List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a List</DialogTitle>
              <DialogDescription>
                <Input
                  placeholder="List Name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Separator />
      <div>
        {lists.map((list, index) => {
          const isOpen = openStates[index] ?? false;
          return (
            <div
              className="flex flex-col items-center w-full"
              key={list.listId}
            >
              <ListTitle
                title={list.name}
                users={list.users}
                listId={list.listId}
                getLists={getLists}
              />
              <div className="absolute right-4">
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  onClick={() => toggleList(index, list.listId)}
                >
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="w-full ">
                <div className="grid 2xl:grid-cols-10 lg:grid-cols-6 sm:grid-cols-6 grid-cols-3 gap-4">
                  {isOpen &&
                    Object.entries(list.items).map(([_id, item]) => {
                      return "seasons" in item ? (
                        <ShowBox
                          item={item as TVType}
                          className=""
                          handleRemoveItem={(itemId) => {
                            handleRemoveItem(list.listId, itemId, "tv");
                          }}
                          listId={list.listId}
                        />
                      ) : (
                        <MovieBox
                          item={item as MovieType}
                          className=""
                          handleRemoveItem={(itemId) => {
                            handleRemoveItem(list.listId, itemId, "movie");
                          }}
                          listId={list.listId}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
