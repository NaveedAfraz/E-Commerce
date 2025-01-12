import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { deleteProduct, getAllProducts } from "@/store/admin-Slice/admin-slice";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  currentEditedId,
}) {
  //console.log("currentedited ID", currentEditedId);
  console.log(product);
  const dispatch = useDispatch();
  const nameChanged = {
    ...product,
    category: product?.cat,
    description: product?.desc,
  };
  delete nameChanged.cat;
  delete nameChanged.desc;
  console.log(nameChanged);
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?.productID);
              setFormData(nameChanged);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() =>
              dispatch(deleteProduct(product?.productID)).then((res) => {
                console.log(res);
                if (res.payload.success === true) {
                  dispatch(getAllProducts());
                }
              })
            }
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
