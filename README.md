# bamazon
*An e-commerce project with CRUD capabilities.*

The program opens with a prompts the user for identification, giving three possible options -- customer, manager, and supervisor. All three options provide different actions that can be performed.

![bamazon opening](/screen_caps/bamazon_opening.png)



## Customer

After customer is selected, the program will access the customer database to read the inventory of products and print out what is in stock. Also then the customer is given a list of items to choose from for purchase.

![customer select](/screen_caps/customer_select.png)


#### Purchase Item
If an item is sold out, it will not appear in the customer's inventory, as they are not able to purchase it. All other items though appear in a carousel list for the customer to choose from, as this is easier for the customer rather than having to type in the exact ID number of the item they would like to purchase. If the customer's purchase would drop the item's quantity below 0, then they are told that they must select fewer of that item.

![sold out](/screen_caps/customer_soldout.png)

![too few](/screen_caps/customer_toofew.png)

#### Remove Item From Cart
Once a customer has put an item (purchased an item), they are then allowed to begin removing items from their cart or checking out. They can then choose an item from their cart to remove, and the quantity they would like to remove. If they try to remove more than they have in their cart, an error is thrown.

Once a proper amount is chosen for removal, the program updates both the inventory in the store, and the customer's cart and total.

![new options](/screen_caps/customer_new_options.png)
![new options](/screen_caps/remove.png)

Just like any store though, we hope our customers don't leave without making a purchase. Unlike any store, we enforce it!

#### Checkout
After selecting an item, the customer is prompted for the amount of the item they would like to purchase, with a summary of the cost of purchasing all of those items, and then asked if they would like to purchase more. If yes, then they are prompted again for the item they want, and if no, their purchase it totaled out, and the program quits.

![finished purchase](/screen_caps/customer_closeout.png)


The access for the database is limited for the customer to only being able to read from the product table, and update the quantity of items left, and to update the departments table once items are purchased (see **supervisor** section for more details). As you can see in the first picture below, this is the store's inventory before the customer's purchase, and after she has purchased some ballpoint pens, gel pens, jeans, and shirts.

![opening inventory](/screen_caps/bamazon_starting_inventory.png)
![closing inventory](/screen_caps/bamazon_ending_inventory.png)


## Manager

The manager has the ability to update inventory stock and prices through out the store. Just like the customer, the manager will be presented with a readout of all of the inventory (including items that are not in stock currently), and he or she can then restock the items, set prices, add new inventory, or delete items.

The first thing we want to do though is ensure that it really is the manager that is doing this, so we ask for their password:

![manager password](/screen_caps/manager_password.png)

Once the password is validated, the inventory is printed for the manager, showing the item, the amount in stock, and the price. Then the options are listed.

![manager inventory](/screen_caps/manager_inventory.png)

#### Stock Inventory or Set Price
If the manager chooses to restock an item, or set it's price, it will run through prompts similar to that of purchasing an item where it get's the item's name and the quantity or price and then update the database accordingly.

#### Add New Item and Delete Items
If the manager chooses to add a new item, it will prompt the manager for the item's name, price, how much to stock this first time, and a list of the current departments to choose from.

![manager inventory](/screen_caps/manager_add_item.png)

Once the item has been added, it will then add the item to the inventory and reprint the inventory.
If the manager is unhappy with an item though, he or she can delete it from the inventory simply by choosing the delete item, and then selecting the item from a list.

Clock out works just like checking out for the customer, and closes the program.

## Supervisor

This functionality is still under construction. Please check back later.
