# bamazon
*An e-commerce project with CRUD capabilities.*

The program opens with a prompts the user for identification, giving three possible options -- customer, manager, and supervisor. All three options provide different actions that can be performed.

![bamazon opening](/screen_caps/bamazon_opening.png)



## Customer

After customer is selected, the program will access the customer database to read the inventory of products and print out what is in stock. Also then the customer is given a list of items to choose from for purchase.

![customer select](/screen_caps/customer_select.png)



If an item is sold out, it will not appear in the customer's inventory, as they are not able to purchase it. All other items though appear in a carousel list for the customer to choose from, as this is easier for the customer rather than having to type in the exact ID number of the item they would like to purchase. If the customer's purchase would drop the item's quantity below 0, then they are told that they must select fewer of that item.

![sold out](/screen_caps/customer_soldout.png)

![too few](/screen_caps/customer_toofew.png)


After selecting an item, the customer is prompted for the amount of the item they would like to purchase, with a summary of the cost of purchasing all of those items, and then asked if they would like to purchase more. If yes, then they are prompted again for the item they want, and if no, their purchase it totaled out, and the program quits.

![finished purchase](/screen_caps/customer_closeout.png)


The access for the database is limited for the customer to only being able to read from the product table, and update the quantity of items left, and to update the departments table once items are purchased (see **supervisor** section for more details). As you can see in the first picture below, this is the store's inventory before the customer's purchase, and after she has purchased some ballpoint pens, gel pens, jeans, and shirts.

![opening inventory](/screen_caps/bamazon_starting_inventory.png)
![closing inventory](/screen_caps/bamazon_ending_inventory.png)


## Manager

The manager has the ability to update inventory stock and prices through out the store. Just like the customer, the manager will be presented with a readout of all of the inventory (including items that are not in stock currently), and he or she can then restock the items, or set their prices.

## Supervisor

This functionality is still under construction. Please check back later.
